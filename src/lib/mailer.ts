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
 *                   "4TUNHub <hello@4tunhub.com>" once the domain is
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

export type MailAttachment = { filename: string; content: Uint8Array };

/**
 * True once MAIL_FROM is set, i.e. the domain is verified in Resend. Until
 * then the test sender can only reach the account's own inbox, so mail to
 * anyone else (an applicant's receipt) must not be attempted.
 */
export const canMailOutside = (): boolean => Boolean(process.env.MAIL_FROM);

export async function sendMail({
  subject,
  text,
  replyTo,
  to,
  attachments,
}: {
  subject: string;
  text: string;
  replyTo?: string;
  /** Defaults to the inbox (MAIL_TO). */
  to?: string[];
  attachments?: MailAttachment[];
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      const files = attachments?.map((a) => `${a.filename} (${a.content.byteLength} B)`).join(", ");
      console.info(
        `[mail:dev] to ${to?.join(", ") ?? "inbox"} — ${subject}\n${text}${files ? `\n[attached] ${files}` : ""}`,
      );
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
      from: process.env.MAIL_FROM ?? "4TUNHub <onboarding@resend.dev>",
      to: to ?? [process.env.MAIL_TO ?? CONTACT_EMAIL],
      subject,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(attachments?.length
        ? {
            attachments: attachments.map((a) => ({
              filename: a.filename,
              content: Buffer.from(a.content).toString("base64"),
            })),
          }
        : {}),
    }),
    // Attachments make the request heavier than a text message.
    signal: AbortSignal.timeout(attachments?.length ? 20_000 : 10_000),
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
