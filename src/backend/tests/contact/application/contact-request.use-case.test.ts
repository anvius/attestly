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
    const useCase = new ContactRequestUseCase(12, messageSender, "Contacto desde DocCum");

    await useCase.execute({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Necesito soporte con una certificacion.",
      captchaAnswer: 12,
      honeypot: ""
    });

    expect(messageSender.sentMessages.length).toBe(1);
    expect(messageSender.sentMessages[0]?.subject).toBe("Contacto desde DocCum");
  });

  it("rejects wrong captcha answer", async () => {
    const useCase = new ContactRequestUseCase(12, new FakeMessageSender(), "Contacto desde DocCum");

    await expect(
      useCase.execute({
        name: "Ada",
        email: "ada@example.com",
        message: "Mensaje suficientemente largo",
        captchaAnswer: 10,
        honeypot: ""
      })
    ).rejects.toThrow("Captcha answer is invalid");
  });
});
