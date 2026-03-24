export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  subject: string;
};

export interface ContactNotifier {
  send(message: ContactMessage): Promise<void>;
}
