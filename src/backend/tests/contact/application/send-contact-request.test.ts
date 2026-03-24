import { describe, expect, it } from "bun:test";
import { SendContactRequest } from "../../../contact/application/send-contact-request";
import type { ContactMessage, ContactNotifier } from "../../../contact/domain/contact-notifier";

class FakeContactNotifier implements ContactNotifier {
  sentMessages: ContactMessage[] = [];

  async send(message: ContactMessage): Promise<void> {
    this.sentMessages.push(message);
  }
}

describe("SendContactRequest", () => {
  it("sends an email for valid contact payload", async () => {
    const notifier = new FakeContactNotifier();
    const useCase = new SendContactRequest(notifier, "Contacto desde DOCCUM");

    await useCase.execute({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Necesito soporte con una certificacion.",
      honeypot: ""
    });

    expect(notifier.sentMessages.length).toBe(1);
    expect(notifier.sentMessages[0]?.subject).toBe("Contacto desde DOCCUM");
  });
});
