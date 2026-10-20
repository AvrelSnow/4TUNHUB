"use server";

import {
  APPLY_LIMITS,
  COHORT_REF_PREFIX,
  PROOF_LIMITS,
  PROOF_SLOTS,
  SW_VERSIONS,
  applicationsOpen,
  proofField,
  type ApplyError,
  type ApplyField,
  type ApplyState,
  type ProofSlot,
  type SwVersion,
} from "./cohort";
import { rateLimited, clientIp, str, EMAIL_RE, PHONE_RE, LINKEDIN_RE } from "./form-guard";
import { sendMail, canMailOutside, MailNotConfigured, type MailAttachment } from "./mailer";
import { isLocale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
import { CONTACT_EMAIL } from "./site";

/**
 * Cohort applications. Same contract as the contact form: the server is
 * the gate, a honeypot traps bots, a per-IP rate limit, generic error codes.
 *
 * One submission carries everything — the details AND the four screenshots
 * — and reaches the inbox as one email with a reference in the subject. The
 * applicant gets a receipt with the same reference, so a reply lands in the
 * same thread. (Cohort 0 had the screenshots arrive separately, with no
 * name, and they could not be matched.)
 */

/** The first bytes of each allowed type: the declared MIME type is the client's word, not proof. */
function looksLikeImage(b: Uint8Array): boolean {
  const jpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const webp =
    String.fromCharCode(b[0], b[1], b[2], b[3]) === "RIFF" &&
    String.fromCharCode(b[8], b[9], b[10], b[11]) === "WEBP";
  return jpeg || png || webp;
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Five characters with no 0/O or 1/I, so it can be read down a phone. */
function newReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `${COHORT_REF_PREFIX}-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

const fill = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  if (str(formData, "company_website") !== "") {
    return { status: "success" };
  }

  if (!applicationsOpen()) {
    return { status: "error", formError: "closed" };
  }

  if (rateLimited(await clientIp())) {
    return { status: "error", formError: "rateLimited" };
  }

  const name = str(formData, "name").slice(0, APPLY_LIMITS.nameMax);
  const email = str(formData, "email").slice(0, APPLY_LIMITS.emailMax);
  const whatsapp = str(formData, "whatsapp").slice(0, APPLY_LIMITS.whatsappMax);
  const linkedin = str(formData, "linkedin").slice(0, APPLY_LIMITS.linkedinMax);
  const org = str(formData, "org").slice(0, APPLY_LIMITS.orgMax);
  const sw = str(formData, "sw");
  const why = str(formData, "why");
  const consent = str(formData, "consent");
  const localeIn = str(formData, "locale");
  const locale = isLocale(localeIn) ? localeIn : "en";
  const values: Partial<Record<ApplyField, string>> = { name, email, whatsapp, linkedin, org, sw, why };

  const fieldErrors: ApplyState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "emailInvalid";
  if (!whatsapp) fieldErrors.whatsapp = "required";
  else if (!PHONE_RE.test(whatsapp.replace(/[\s().-]/g, ""))) fieldErrors.whatsapp = "whatsappInvalid";
  // The LinkedIn profile is how the two follows get checked, so a seat
  // cannot be awarded without one.
  if (!linkedin) fieldErrors.linkedin = "required";
  else if (!LINKEDIN_RE.test(linkedin)) fieldErrors.linkedin = "linkedinInvalid";
  if (!org) fieldErrors.org = "required";
  if (!SW_VERSIONS.includes(sw as SwVersion)) fieldErrors.sw = "choose";
  if (!why) fieldErrors.why = "required";
  else if (why.length < APPLY_LIMITS.whyMin) fieldErrors.why = "tooShort";
  else if (why.length > APPLY_LIMITS.whyMax) fieldErrors.why = "tooLong";
  if (consent !== "yes") fieldErrors.consent = "consent";

  const attachments: MailAttachment[] = [];
  for (const slot of PROOF_SLOTS) {
    const error = await checkProof(formData.get(proofField(slot)), slot, attachments);
    if (error) fieldErrors[proofField(slot)] = error;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  const reference = newReference();

  try {
    await sendMail({
      subject: `[Cohort 0] ${reference} · ${name}`,
      text: [
        `Reference: ${reference}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `WhatsApp: ${whatsapp}`,
        `LinkedIn: ${linkedin}`,
        `School / employer: ${org}`,
        `SolidWorks: ${sw}`,
        `Language: ${locale}`,
        "",
        "Why:",
        why,
        "",
        `Screenshots attached: ${attachments.map((a) => a.filename).join(", ")}`,
      ].join("\n"),
      replyTo: email,
      attachments,
    });
  } catch (err) {
    return {
      status: "error",
      formError: err instanceof MailNotConfigured ? "unavailable" : "failed",
      values,
    };
  }

  // The receipt is a courtesy, not part of the application: if it fails, the
  // application is still in, and saying otherwise would make people apply twice.
  let receipt = false;
  if (canMailOutside() || process.env.NODE_ENV !== "production") {
    const r = (await getDictionary(locale)).cohort.receipt;
    try {
      await sendMail({
        to: [email],
        replyTo: process.env.MAIL_TO ?? CONTACT_EMAIL,
        subject: fill(r.subject, { ref: reference }),
        text: fill(r.body, { name, ref: reference }),
      });
      receipt = true;
    } catch {
      // Logged by the mailer.
    }
  }

  return { status: "success", reference, receipt };
}

async function checkProof(
  value: FormDataEntryValue | null,
  slot: ProofSlot,
  out: MailAttachment[],
): Promise<ApplyError | null> {
  if (!(value instanceof File) || value.size === 0) return "proofMissing";
  if (value.size > PROOF_LIMITS.maxBytes) return "proofTooLarge";
  if (!(PROOF_LIMITS.types as readonly string[]).includes(value.type)) return "proofType";
  const bytes = new Uint8Array(await value.arrayBuffer());
  if (!looksLikeImage(bytes)) return "proofType";
  out.push({ filename: `${out.length + 1}-${slot}.${EXT[value.type]}`, content: bytes });
  return null;
}
