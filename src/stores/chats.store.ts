import type { Chat } from '@/interfaces';
import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam
} from '@mlc-ai/web-llm';
import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export const useChatsStore = defineStore('chats', () => {
  const route = useRoute();

  const chats = ref<Chat[]>([]);

  const modelOptions = ref([
    { value: 'Qwen2.5-3B-Instruct-q4f16_1-MLC' },
    { value: 'Llama-3.2-3B-Instruct-q4f16_1-MLC' },
    { value: 'RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC' },
    { value: 'Qwen2-7B-Instruct-q4f16_1-MLC' },
    { value: 'Llama-2-7b-chat-hf-q4f16_1-MLC' },
    { value: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC' },
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

  function addAssistantMessageToChat(
    chatId: string,
    message: ChatCompletionAssistantMessageParam
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

  function addUserMessageToChat(
    chatId: string,
    message: ChatCompletionUserMessageParam
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
    addAssistantMessageToChat,
    addUserMessageToChat
  };
});
