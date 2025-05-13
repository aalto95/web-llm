import type { Message } from '@/types';

export interface Chat {
  title: string;
  id: string;
  model: string;
  messages: Message[];
}
