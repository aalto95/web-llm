import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

export type Message = {
  createdOn: string;
} & ChatCompletionMessageParam;
