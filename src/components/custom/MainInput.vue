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
import { CreateWebWorkerMLCEngine } from '@mlc-ai/web-llm';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// === STATE ===
const model = ref('');
const query = ref('');
const isInitializing = ref(true);
const isQuerying = ref(false);
const progressText = ref('');

// === STORES & ROUTING ===
const chatsStore = useChatsStore();
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

// === MODEL OPTIONS ===
const options = [{ value: 'Qwen2-0.5B-Instruct-q0f32-MLC' }];
let engine: inference.WebWorkerMLCEngine | null = null;

// === LIFECYCLE ===
onMounted(() => {
  const currentChat = chatsStore.currentChat;
  if (currentChat) {
    model.value = currentChat.model;
    selectModel(model.value);
  }
});

// === FUNCTIONS ===
const initLLM = async (modelName: string): Promise<void> => {
  try {
    const initProgressCallback = (report: inference.InitProgressReport) => {
      progressText.value = report.text;
    };

    engine = await CreateWebWorkerMLCEngine(
      new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
      modelName,
      { initProgressCallback }
    );

    isInitializing.value = false;
  } catch (error) {
    console.error('Failed to initialize LLM:', error);
    alert('Failed to load model');
  }
};

const scrollToBottom = () => {
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, 50);
};

const makeQuery = async (): Promise<void> => {
  if (!engine || isQuerying.value) {
    return;
  }

  isQuerying.value = true;
  const userMessage = { role: 'user' as const, content: query.value };
  const chatUUID = self.crypto.randomUUID();

  try {
    // Save user message
    const chatId = id.value ? (id.value as string) : chatUUID;
    if (!id.value) {
      chatsStore.createChat(model.value, userMessage, chatUUID);
      router.push(`/chats/${chatUUID}`);
    } else {
      chatsStore.addMessageToChat(chatId, userMessage);
    }

    scrollToBottom();

    // Get AI response
    const reply = await engine.chat.completions.create({
      messages: [userMessage]
    });

    const aiMessage = {
      role: reply.choices[0].message.role,
      content: reply.choices[0].message.content ?? 'No response'
    };

    // Save AI message
    chatsStore.addMessageToChat(chatId, aiMessage);

    // Reset UI
    query.value = '';
    scrollToBottom();
  } catch (error) {
    console.error('Error during completion:', error);
  } finally {
    isQuerying.value = false;
  }
};

const selectModel = (selectedModel: string): void => {
  if (!selectedModel) {
    return;
  }

  model.value = selectedModel;
  initLLM(selectedModel).catch((err) => {
    console.error('Model selection failed:', err);
    alert('Could not load the selected model.');
  });
};
</script>

<template>
  <div
    class="w-full flex flex-col h-full gap-4 text-left relative p-4 pt-20 pb-24"
  >
    <!-- Model Selector -->
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

    <!-- Loading State -->
    <div v-if="isInitializing" class="text-center py-4">
      {{ progressText || 'Select model' }}
    </div>

    <!-- Chat UI -->
    <template v-else>
      <!-- Input Section -->
      <div
        class="flex gap-4 fixed left-0 w-full p-4 dark:bg-background border-t-1 bg-white box-border bottom-0 z-10"
      >
        <Input
          v-model="query"
          class="w-full h-12"
          placeholder="Ask away..."
          :disabled="isQuerying"
        />
        <Button class="h-12" :disabled="isQuerying" @click="makeQuery"
          >Submit</Button
        >
      </div>

      <!-- Chat Messages -->
      <div
        v-if="chatsStore.currentChat?.messages.length"
        class="space-y-4 overflow-auto"
      >
        <div
          v-for="(message, index) in chatsStore.currentChat.messages"
          :key="index"
          :class="[
            'p-4 rounded-2xl w-fit max-w-[80%]',
            message.role === 'user'
              ? 'bg-indigo-50 dark:bg-indigo-950 self-end ml-auto'
              : 'bg-gray-50 dark:bg-gray-900 self-start mr-auto'
          ]"
        >
          {{ message.content }}
        </div>
      </div>
    </template>
  </div>
</template>
