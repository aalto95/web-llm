<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { inference } from '@/inference';
import { useChatsStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const options = [{ value: 'Qwen2-0.5B-Instruct-q0f32-MLC' }];
const chatsStore = useChatsStore();
const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const model = ref('');

let engine: inference.MLCEngine | null = null;

const isInitializing = ref<boolean>(true);
const isQuerying = ref<boolean>(false);
const query = ref<string>('');
const progressText = ref<string>('');

const initLLM = async (model: string): Promise<void> => {
  const initProgressCallback = (initProgress: inference.InitProgressReport) => {
    progressText.value = initProgress.text;
  };

  engine = await inference.CreateMLCEngine(model, {
    initProgressCallback
  });
};

const makeQuery = async (): Promise<void> => {
  if (!engine) {
    return;
  }

  const newChatUUID = self.crypto.randomUUID();
  isQuerying.value = true;

  const userMessage = {
    role: 'user' as const,
    content: query.value
  };

  // Save user message
  if (!id) {
    chatsStore.createChat(model.value, userMessage, newChatUUID);
  } else {
    chatsStore.addMessageToChat(id, userMessage);
  }

  try {
    const reply = await engine.chat.completions.create({
      messages: [userMessage]
    });

    const aiMessage = {
      role: reply.choices[0].message.role,
      content: reply.choices[0].message.content ?? 'No response'
    };

    // Save AI message
    if (!id) {
      chatsStore.addMessageToChat(newChatUUID, aiMessage);
      router.push('/chats/' + newChatUUID);
    } else {
      chatsStore.addMessageToChat(id, aiMessage);
    }

    // Reset UI state
    query.value = '';
  } catch (error) {
    console.error('Error fetching completion:', error);
  } finally {
    isQuerying.value = false;
  }
};

const selectModel = (e: string): void => {
  if (e) {
    model.value = e;
    initLLM(model.value)
      .then(() => {
        isInitializing.value = false;
      })
      .catch((error) => {
        console.error(error);
        alert(error);
      });
  }
};

onMounted(() => {
  if (id) {
    chatsStore.currentChatId = id as string;
    const currentChat = chatsStore.currentChat;
    if (currentChat) {
      model.value = currentChat.model;
      selectModel(model.value);
    }
  } else {
    chatsStore.currentChatId = '';
  }
});
</script>

<template>
  <div class="w-full flex flex-col h-full gap-4 text-left">
    <Select
      :model-value="model"
      :disabled="!!model"
      @update:model-value="(e) => selectModel(e as string)"
    >
      <SelectTrigger class="w-full">
        <SelectValue placeholder="Select LLM" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.value }}
        </SelectItem>
      </SelectContent>
    </Select>

    <template v-if="!isInitializing">
      <span class="flex gap-4">
        <Input
          class="w-full h-12"
          placeholder="Ask away..."
          v-model="query"
          :disabled="isQuerying"
        />

        <Button class="h-12" :disabled="isQuerying" @click="makeQuery">
          Submit
        </Button>
      </span>

      <template
        v-for="(reply, index) in chatsStore.currentChat?.messages"
        :key="index"
      >
        <div
          v-if="reply.role === 'user'"
          class="dark:bg-indigo-950 bg-indigo-50 p-4 rounded-2xl w-fit self-end"
        >
          {{ reply.content }}
        </div>

        <div
          v-if="reply.role === 'assistant'"
          class="dark:bg-gray-900 bg-gray-50 p-4 rounded-2xl w-fit"
        >
          {{ reply.content }}
        </div>
      </template>
    </template>
    <template v-else>
      {{ progressText }}
    </template>
  </div>
</template>
