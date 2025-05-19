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
import { formatDate } from '@/helpers';
import { inference } from '@/inference';
import { useChatsStore } from '@/stores';
import { CreateMLCEngine } from '@mlc-ai/web-llm';
import { LucideArrowUp, LucideStopCircle } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// === STATE ===
const model = ref('');
const query = ref('');
const isInitializing = ref(true);
const isQuerying = ref(false);
const progressText = ref('');
const chatBox = ref<HTMLDivElement | null>(null);

// === STORES & ROUTING ===
const chatsStore = useChatsStore();
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

// === MODEL OPTIONS ===
const options = chatsStore.modelOptions;

let engine: inference.MLCEngine | null = null;

// === LIFECYCLE ===
onMounted(() => {
  const currentChat = chatsStore.currentChat;
  if (currentChat) {
    model.value = currentChat.model;
    selectModel(model.value);
  }
});

watch(
  () => chatsStore.currentChat,
  () => {
    const currentChat = chatsStore.currentChat;
    if (currentChat) {
      model.value = currentChat.model;
      selectModel(model.value);
    }
  }
);

// === FUNCTIONS ===
const initLLM = async (modelName: string): Promise<void> => {
  try {
    const initProgressCallback = (report: inference.InitProgressReport) => {
      progressText.value = report.text;
    };

    engine = await CreateMLCEngine(modelName, {
      initProgressCallback
    });

    isInitializing.value = false;
    scrollToBottom();
  } catch (error) {
    console.error('Failed to initialize LLM:', error);
    alert('Failed to load model');
  }
};

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatBox.value) {
      const container = chatBox.value;
      container.scrollTop = container.scrollHeight;
    }
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

const stopQuery = async (): Promise<void> => {
  if (!engine) {
    return;
  }

  await engine.interruptGenerate().then(() => {
    isQuerying.value = false;
  });
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
  <div class="w-full flex flex-col h-dvh gap-4 text-left relative pt-20 pb-32">
    <!-- Model Selector -->
    <div class="w-full px-4">
      <Select
        :model-value="model"
        :disabled="!!chatsStore.currentChat"
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
    </div>

    <!-- Loading State -->
    <div v-if="isInitializing" class="text-center py-4">
      {{ progressText || 'Select model' }}
    </div>

    <!-- Chat UI -->
    <template v-else>
      <!-- Input Section -->
      <div
        class="flex flex-col gap-2 absolute left-0 w-full p-4 dark:bg-background border-t-1 bg-white box-border bottom-0"
      >
        <span class="flex gap-4">
          <Input
            v-model="query"
            class="w-full h-12 text-sm"
            placeholder="How can I help you today?"
            :disabled="isQuerying"
            @keyup.enter="makeQuery"
          />
          <Button v-if="!isQuerying" class="h-12 w-12" @click="makeQuery">
            <LucideArrowUp></LucideArrowUp>
          </Button>
          <Button v-else class="h-12 w-12" @click="stopQuery">
            <LucideStopCircle></LucideStopCircle>
          </Button>
        </span>
        <p class="text-center text-xs">
          AI-generated content may not be accurate.
        </p>
      </div>

      <!-- Chat Messages -->
      <div
        v-if="chatsStore.currentChat?.messages.length"
        class="space-y-4 overflow-auto px-4 scroll-smooth scrollbar-thin scrollbar-track-background scrollbar-thumb-accent-foreground"
        ref="chatBox"
      >
        <template
          v-for="(message, index) in chatsStore.currentChat.messages"
          :key="index"
        >
          <span
            class="flex gap-4 mb-2"
            :class="{
              'justify-end': message.role === 'user'
            }"
          >
            <p v-if="message.role === 'assistant'">
              {{ chatsStore.currentChat?.model }}
            </p>
            <p v-if="message?.createdOn">
              {{ formatDate(message?.createdOn) }}
            </p>
          </span>

          <div
            :class="[
              'p-4 rounded-2xl w-fit max-w-[80%]',
              message.role === 'user'
                ? 'bg-indigo-50 dark:bg-indigo-950 self-end ml-auto'
                : 'bg-gray-50 dark:bg-gray-900 self-start mr-auto'
            ]"
          >
            {{ message.content }}
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
