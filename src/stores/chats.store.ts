import type { Chat } from '@/interfaces';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export const useChatsStore = defineStore('chats', () => {
  const route = useRoute();

  const chats = ref<Chat[]>([]);

  const modelOptions = ref([
    { value: 'Qwen2-0.5B-Instruct-q0f32-MLC' },
    { value: 'Llama-3.2-1B-Instruct-q4f32_1-MLC' }
  ]);

  const currentChat = computed(() =>
    chats.value.find((chat) => chat.id === route.params.id)
  );

  function getChatsOfModel(model: string) {
    return chats.value.filter((chat) => chat.model === model);
  }

  function createChat(
    model: string,
    message: ChatCompletionMessageParam,
    uuid: string
  ) {
    chats.value.push({
      title: message.content as string,
      model: model,
      id: uuid,
      messages: [{ ...message, createdOn: String(new Date()) }]
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
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { ...message, createdOn: String(new Date()) }
          ]
        };
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
    modelOptions,
    currentChat,
    createChat,
    getChatsOfModel,
    deleteChat,
    addMessageToChat
  };
});
