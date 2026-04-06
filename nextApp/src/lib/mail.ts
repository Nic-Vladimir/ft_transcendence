import nodemailer from "nodemailer";

type MailPayload = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

function getRequiredEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

function getSmtpPort(): number {
  const rawPort = process.env.SMTP_PORT?.trim();
  const port = rawPort ? Number(rawPort) : 587;

  return Number.isInteger(port) && port > 0 ? port : 587;
}

export function isMailConfigured(): boolean {
  return Boolean(
    getRequiredEnv("SMTP_HOST") &&
      getRequiredEnv("SMTP_USER") &&
      getRequiredEnv("SMTP_PASS") &&
      getRequiredEnv("MAIL_FROM")
  );
}

function createTransport() {
  const host = getRequiredEnv("SMTP_HOST");
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  if (!host || !user || !pass) {
    throw new Error("SMTP is not fully configured");
  }

  const port = getSmtpPort();

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendMail(payload: MailPayload): Promise<void> {
  const from = getRequiredEnv("MAIL_FROM");
  if (!from) {
    throw new Error("MAIL_FROM is not configured");
  }

  const transporter = createTransport();

  await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}
