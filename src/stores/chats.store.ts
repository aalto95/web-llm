import type { Chat } from '@/interfaces';
import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<Chat[]>([]);
  const currentChatId = ref<string>('');

  const currentChat = computed(() =>
    chats.value.find((chat) => chat.id === currentChatId.value)
  );

  function createChat(
    model: string,
    message: { role: string; content: string }
  ) {
    chats.value.push({
      title: message.content,
      model: model,
      id: self.crypto.randomUUID(),
      messages: [message]
    });

    localStorage.setItem('chats', JSON.stringify(chats.value));
  }

  function addMessageToChat(
    chatId: string,
    message: {
      role: string;
      content: string;
    }
  ) {
    chats.value = chats.value.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, messages: [...chat.messages, message] };
      }
      return chat;
    });

    localStorage.setItem('chats', JSON.stringify(chats.value));
  }

  onMounted(() => {
    const chatsLS = localStorage.getItem('chats');
    if (chatsLS) {
      chats.value = JSON.parse(chatsLS);
    }
  });

  return { chats, currentChatId, createChat, currentChat, addMessageToChat };
});
