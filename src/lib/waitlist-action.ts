"use server";

import {
  TRACK_VALUES,
  WAITLIST_LIMITS,
  type TrackValue,
  type WaitlistState,
} from "./waitlist";
import { rateLimited, clientIp, str, EMAIL_RE } from "./form-guard";
import { sendMail, MailNotConfigured } from "./mailer";

/**
 * Waitlist signups. Same contract as the other two forms: the server is
 * the gate, a honeypot traps bots, a per-IP rate limit, generic codes out.
 *
 * Delivery is one email per signup, and the subject and first line are
 * written to be *machine-readable on purpose*: a Gmail search for
 * "[Waitlist]" exports the whole list as CSV-shaped lines. That is enough
 * for the first hundred people and needs no database, no account system
 * and no third-party list tool. Past a hundred, move this to a real list
 * — the parseable line is what makes that migration a copy-paste.
 */
export async function submitWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  if (str(formData, "company_website") !== "") {
    return { status: "success" };
  }

  if (rateLimited(await clientIp())) {
    return { status: "error", formError: "rateLimited" };
  }

  const email = str(formData, "email").slice(0, WAITLIST_LIMITS.emailMax);
  const name = str(formData, "name").slice(0, WAITLIST_LIMITS.nameMax);
  const tracks = formData
    .getAll("tracks")
    .filter((v): v is string => typeof v === "string")
    .filter((v): v is TrackValue => TRACK_VALUES.includes(v as TrackValue));
  const values = { email, name, tracks };

  const fieldErrors: WaitlistState["fieldErrors"] = {};
  if (!email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "emailInvalid";
  // A signup with no track is a subscription to nothing: we would have no
  // honest basis for any email we later sent.
  if (tracks.length === 0) fieldErrors.tracks = "tracksRequired";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  const list = tracks.join(", ");
  try {
    await sendMail({
      subject: `[Waitlist] ${list} — ${email}`,
      text: [
        // One parseable line first, then the same facts for a human.
        `${new Date().toISOString()},${email},"${name}","${list}"`,
        "",
        `Email:  ${email}`,
        `Name:   ${name || "—"}`,
        `Tracks: ${list}`,
      ].join("\n"),
      replyTo: email,
    });
  } catch (err) {
    return {
      status: "error",
      formError: err instanceof MailNotConfigured ? "unavailable" : "failed",
      values,
    };
  }

  return { status: "success" };
}
