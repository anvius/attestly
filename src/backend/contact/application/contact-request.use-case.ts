import type { ContactMessageSender } from "./interfaces/contact-message-sender";

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
  honeypot?: string | null;
};

export class ContactRequestUseCase {
  constructor(
    private readonly contactMessageSender: ContactMessageSender,
    private readonly defaultSubject: string
  ) {}

  async execute(request: ContactRequest): Promise<void> {
    const name = request.name.trim();
    const email = request.email.trim();
    const message = request.message.trim();

    if (request.honeypot && request.honeypot.trim().length > 0) {
      throw new Error("Spam detected");
    }

    if (name.length < 2) {
      throw new Error("Name is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Email is invalid");
    }

    if (message.length < 20) {
      throw new Error("Message is too short");
    }

    await this.contactMessageSender.send({
      name,
      email,
      message,
      subject: this.defaultSubject
    });
  }
}
