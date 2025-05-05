export interface Chat {
  title: string;
  id: string;
  model: string;
  messages: { role: string; content: string }[];
}
