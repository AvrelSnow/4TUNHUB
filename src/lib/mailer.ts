import { CONTACT_EMAIL } from "./site";

/**
 * Outbound email for the forms, through Resend's HTTP API (no SDK).
 *
 * Configure on the host:
 *   RESEND_API_KEY  required. Without it, production submissions fail
 *                   loudly with `MailNotConfigured` so the form can offer
 *                   email instead; nothing is ever silently dropped.
 *   MAIL_TO         optional, defaults to CONTACT_EMAIL.
 *   MAIL_FROM       optional, defaults to Resend's test sender, which can
 *                   only deliver to the Resend account's own address. Use
 *                   "4TUN Hub <hello@4tunhub.com>" once the domain is
 *                   verified in Resend.
 *
 * In development with no key, the message is logged and treated as sent,
 * so the forms can be exercised locally.
 */
export class MailNotConfigured extends Error {
  constructor() {
    super("Mail delivery is not configured");
    this.name = "MailNotConfigured";
  }
}

export async function sendMail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[mail:dev] ${subject}\n${text}`);
      return;
    }
    throw new MailNotConfigured();
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM ?? "4TUN Hub <onboarding@resend.dev>",
      to: [process.env.MAIL_TO ?? CONTACT_EMAIL],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    // The host's log gets the provider's own reason — an unverified domain,
    // a revoked key — because "something went wrong" in the browser is not
    // enough to fix a form that has stopped delivering. Only the provider's
    // name and message are read: never the body, which echoes the payload.
    const reason = await res
      .json()
      .then((b: { name?: string; message?: string }) =>
        [b?.name, b?.message].filter(Boolean).join(": "),
      )
      .catch(() => "");
    console.error(`[mail] Resend responded ${res.status}${reason ? ` — ${reason}` : ""}`);
    // Status only to the caller: the response body can echo the payload.
    throw new Error(`Mail provider responded ${res.status}`);
  }
}
