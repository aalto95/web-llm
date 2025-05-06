import type { Chat } from '@/interfaces';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<Chat[]>([]);
  const route = useRoute();

  const currentChat = computed(() =>
    chats.value.find((chat) => chat.id === route.params.id)
  );

  function createChat(
    model: string,
    message: ChatCompletionMessageParam,
    uuid: string
  ) {
    chats.value.push({
      title: message.content as string,
      model: model,
      id: uuid,
      messages: [message]
    });

    localStorage.setItem('chats', JSON.stringify(chats.value));
  }

  function deleteChat(chatId: string) {
    chats.value = chats.value.filter((chat) => chat.id !== chatId);

    localStorage.setItem('chats', JSON.stringify(chats.value));
  }

  function addMessageToChat(
    chatId: string,
    message: ChatCompletionMessageParam
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

  return {
    chats,
    currentChat,
    createChat,
    deleteChat,
    addMessageToChat
  };
});
