import nodemailer from "nodemailer";
import { ExperimentStatusUpdatedPayload } from "../events/experimentEvents.js";

export async function sendStatusEmail(payload: ExperimentStatusUpdatedPayload): Promise<void> {
  const {
    experimentId,
    scientistUsername,
    scientistEmail,
    machine,
    oldStatus,
    newStatus,
  } = payload;

  const recipient = scientistEmail || process.env.SMTP_USER;
  const subject = `[Open Science Lab] Proposal #${experimentId} Status Update: ${newStatus}`;
  const text = `Hello ${scientistUsername},\n\nYour instrument request (#${experimentId}) for ${machine} has been updated from "${oldStatus}" to "${newStatus}".\n\nRegards,\nOpen Science Facility Team`;

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    process.env.SMTP_PASS === "your_smtp_app_password"
  ) {
    console.log(
      `[EMAIL OBSERVER - DEV MODE] Would send email to ${recipient || scientistUsername}: ${subject}`,
    );
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Open Science Portal" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      text,
    });

    console.log(
      `[EMAIL OBSERVER] Notification email sent for Proposal #${experimentId}`,
    );
  } catch (err) {
    console.error(
      `[EMAIL OBSERVER] Failed to send email for Proposal #${experimentId}:`,
      err,
    );
  }
}
