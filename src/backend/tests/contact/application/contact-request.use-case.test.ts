import { describe, expect, it } from "bun:test";
import { ContactRequestUseCase } from "../../../contact/application/contact-request.use-case";
import type { ContactMessage, ContactMessageSender } from "../../../contact/application/interfaces/contact-message-sender";

class FakeMessageSender implements ContactMessageSender {
  sentMessages: ContactMessage[] = [];

  async send(message: ContactMessage): Promise<void> {
    this.sentMessages.push(message);
  }
}

describe("ContactRequestUseCase", () => {
  it("sends an email for valid contact payload", async () => {
    const messageSender = new FakeMessageSender();
    const useCase = new ContactRequestUseCase(messageSender, "Contacto desde DOCCUM");

    await useCase.execute({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Necesito soporte con una certificacion.",
      honeypot: ""
    });

    expect(messageSender.sentMessages.length).toBe(1);
    expect(messageSender.sentMessages[0]?.subject).toBe("Contacto desde DOCCUM");
  });});
