export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  subject: string;
};

export interface ContactMessageSender {
  send(message: ContactMessage): Promise<void>;
}
