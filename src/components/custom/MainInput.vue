<script setup lang="ts">
import { ref, onMounted } from "vue";
import { inference } from "@/inference";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatParameter =
  | inference.ChatCompletionSystemMessageParam
  | inference.ChatCompletionUserMessageParam;

const options = [{ value: "Qwen2-0.5B-Instruct-q0f32-MLC" }];

let engine: inference.MLCEngine | null = null;

const isInitializing = ref<boolean>(true);
const isQuerying = ref<boolean>(false);
const reply = ref<inference.ChatCompletion | null>(null);
const query = ref<string>("");
const progressText = ref<string>("");

const initLLM = async (model: string): Promise<void> => {
  const initProgressCallback = (initProgress: inference.InitProgressReport) => {
    progressText.value = initProgress.text;
  };

  engine = await inference.CreateMLCEngine(model, {
    initProgressCallback,
  });

  reply.value = await engine.chat.completions.create({
    messages: generateMessages("Hello!"),
  });
};

const makeQuery = async (): Promise<void> => {
  if (!engine) {
    return;
  }

  isQuerying.value = true;
  reply.value = await engine.chat.completions.create({
    messages: generateMessages(query.value),
  });
  query.value = "";
  isQuerying.value = false;
};

const generateMessages = (text: string): ChatParameter[] => {
  return [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: text },
  ];
};

const selectModel = (e: string): void => {
  if (e) {
    const model = e;
    initLLM(model)
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
  // Optionally trigger initialization here if needed
});
</script>

<template>
  <div class="w-full flex flex-col h-full gap-4">
    <Select @update:model-value="(e) => selectModel(e as string)">
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

      <div
        v-if="reply"
        class="dark:bg-background bg-indigo-50 flex p-2 justify-between items-center w-full rounded-2xl"
      >
        <p v-for="replyChoice in reply.choices" :key="replyChoice.index">
          {{ replyChoice.message.content }}
        </p>
      </div>
    </template>
    <template v-else>
      {{ progressText }}
    </template>
  </div>
</template>
