import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

export interface Chat {
  title: string;
  id: string;
  model: string;
  messages: ChatCompletionMessageParam[];
}
