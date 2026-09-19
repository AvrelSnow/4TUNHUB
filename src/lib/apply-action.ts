"use server";

import {
  APPLY_LIMITS,
  SW_VERSIONS,
  applicationsOpen,
  type ApplyField,
  type ApplyState,
  type SwVersion,
} from "./cohort";
import { rateLimited, clientIp, str, EMAIL_RE, PHONE_RE } from "./form-guard";
import { sendMail, MailNotConfigured } from "./mailer";

/**
 * Cohort 0 applications. Same contract as the contact form: the server is
 * the gate, a honeypot traps bots, a per-IP rate limit, generic error codes.
 */
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
  const org = str(formData, "org").slice(0, APPLY_LIMITS.orgMax);
  const sw = str(formData, "sw");
  const why = str(formData, "why");
  const consent = str(formData, "consent");
  const values: Partial<Record<ApplyField, string>> = { name, email, whatsapp, org, sw, why };

  const fieldErrors: ApplyState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "emailInvalid";
  if (!whatsapp) fieldErrors.whatsapp = "required";
  else if (!PHONE_RE.test(whatsapp.replace(/[\s().-]/g, ""))) fieldErrors.whatsapp = "whatsappInvalid";
  if (!org) fieldErrors.org = "required";
  if (!SW_VERSIONS.includes(sw as SwVersion)) fieldErrors.sw = "choose";
  if (!why) fieldErrors.why = "required";
  else if (why.length < APPLY_LIMITS.whyMin) fieldErrors.why = "tooShort";
  else if (why.length > APPLY_LIMITS.whyMax) fieldErrors.why = "tooLong";
  if (consent !== "yes") fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  try {
    await sendMail({
      subject: `[Cohort 0] Application: ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `WhatsApp: ${whatsapp}`,
        `School / employer: ${org}`,
        `SolidWorks: ${sw}`,
        "",
        "Why:",
        why,
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
