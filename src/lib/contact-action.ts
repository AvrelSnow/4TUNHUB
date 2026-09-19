"use server";

import {
  LIMITS,
  TOPIC_VALUES,
  type ContactState,
  type FieldName,
  type TopicValue,
} from "./contact";
import { rateLimited, clientIp, str, EMAIL_RE } from "./form-guard";
import { sendMail, MailNotConfigured } from "./mailer";

/**
 * R12 security contract: the server is the gate; client validation is UX
 * only. Every field is validated here, a honeypot traps naive bots, and
 * submissions are rate-limited per IP. Errors are generic codes; internals
 * are never echoed.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // 1) Honeypot: a real user never fills this. Pretend success, deliver nothing.
  if (str(formData, "company_website") !== "") {
    return { status: "success" };
  }

  // 2) Rate limit per IP.
  if (rateLimited(await clientIp())) {
    return { status: "error", formError: "rateLimited" };
  }

  // 3) Collect + validate.
  const name = str(formData, "name").slice(0, LIMITS.nameMax);
  const email = str(formData, "email").slice(0, LIMITS.emailMax);
  const topic = str(formData, "topic");
  const message = str(formData, "message");
  const values: Record<FieldName, string> = { name, email, topic, message };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "emailInvalid";
  if (!TOPIC_VALUES.includes(topic as TopicValue)) fieldErrors.topic = "topicRequired";
  if (!message) fieldErrors.message = "required";
  else if (message.length < LIMITS.messageMin) fieldErrors.message = "messageTooShort";
  else if (message.length > LIMITS.messageMax) fieldErrors.message = "messageTooLong";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values };
  }

  // 4) Deliver. Any failure is a generic code, and the values come back so
  //    the visitor can resend by email without retyping.
  try {
    await sendMail({
      subject: `[4TUN Hub] ${topic}: ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
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
