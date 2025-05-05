import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<
    {
      title: string;
      id: string;
      messages: { role: string; context: string }[];
    }[]
  >([
    {
      title: 'First Chat',
      id: 'dsds',
      messages: [{ role: 'user', context: 'Hello' }]
    }
  ]);

  return { chats };
});
