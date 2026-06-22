import axios from "axios";

const EMAIL_SERVER_ENDPOINT = process.env.EMAIL_SERVER_ENDPOINT;

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: SendEmailParams) => {
  if (!EMAIL_SERVER_ENDPOINT) {
    console.warn(
      "EMAIL_SERVER_ENDPOINT is not set. Email content:",
      JSON.stringify({ to, subject, text }, null, 2),
    );
    return;
  }

  try {
    await axios.post(EMAIL_SERVER_ENDPOINT, {
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const sendVerificationOtpEmail = async (to: string, otp: string) => {
  const subject = "Verify your email";
  const text = `Your email verification OTP is: ${otp}\n\nThis code expires in 10 minutes.`;

  const html = `
    <p>Your email verification OTP:</p>
    <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${otp}</p>
    <p>This code expires in 10 minutes.</p>
  `;

  await sendEmail({ to, subject, text, html });
};

export const sendPasswordResetOtpEmail = async (to: string, otp: string) => {
  const subject = "Your password reset OTP";
  const text = `Your OTP for password reset is: ${otp}\n\nThis code expires in 10 minutes.`;

  const html = `
    <p>Your OTP for password reset:</p>
    <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${otp}</p>
    <p>This code expires in 10 minutes.</p>
  `;

  await sendEmail({ to, subject, text, html });
};
