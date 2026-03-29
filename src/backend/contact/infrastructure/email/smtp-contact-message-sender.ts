import nodemailer from "nodemailer";
import type { ContactMessage, ContactMessageSender } from "../../application/interfaces/contact-message-sender";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  toEmail: string;
};

export class SmtpContactMessageSender implements ContactMessageSender {
  private readonly transporter;

  constructor(private readonly config: SmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: config.password
      }
    });
  }

  async send(message: ContactMessage): Promise<void> {
    const textBody = [
      `Nombre: ${message.name}`,
      `Email: ${message.email}`,
      "",
      message.message
    ].join("\n");

    await this.transporter.sendMail({
      from: this.config.fromEmail,
      to: this.config.toEmail,
      subject: message.subject,
      text: textBody,
      replyTo: message.email
    });
  }
}
