<script lang="ts">
  import type {
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
    InitProgressReport,
  } from "@mlc-ai/web-llm";
  import Button from "../ui/button/button.svelte";
  import Input from "../ui/input/input.svelte";
  import { inference } from "$lib/inference";
  import * as Select from "$lib/components/ui/select";
  import type { Selected } from "bits-ui";

  let engine: inference.MLCEngine;
  let reply: inference.ChatCompletion;
  let query: string = "";
  let isInitializing = true;
  let isQuerying = false;
  let progressText = "";

  const options = [{ value: "Qwen2-0.5B-Instruct-q0f32-MLC" }];

  async function initLLM(model: string): Promise<void> {
    const initProgressCallback = (initProgress: InitProgressReport) => {
      progressText = initProgress.text;
    };

    engine = await inference.CreateMLCEngine(model, {
      initProgressCallback: initProgressCallback,
    });

    reply = await engine.chat.completions.create({
      messages: generateMessages("Hello!"),
    });
  }

  async function makeQuery(): Promise<void> {
    isQuerying = true;
    reply = await engine.chat.completions.create({
      messages: generateMessages(query),
    });
    query = "";
    isQuerying = false;
  }

  function generateMessages(
    text: string
  ): (ChatCompletionSystemMessageParam | ChatCompletionUserMessageParam)[] {
    return [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: text },
    ];
  }

  function selectModel(e: Selected<string | undefined> | undefined): void {
    if (e && e.value) {
      const model = e.value;
      initLLM(model)
        .then(() => {
          isInitializing = false;
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
</script>

<div class="w-full flex flex-col h-full gap-4">
  <Select.Root onSelectedChange={selectModel}>
    <Select.Trigger class="w-full">
      <Select.Value placeholder="Select LLM" />
    </Select.Trigger>
    <Select.Content>
      {#each options as option}
        <Select.Item value={option.value}>{option.value}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>

  {#if !isInitializing}
    <span class="flex gap-4">
      <Input
        class="w-full h-12 text-lg xl:text-xl"
        placeholder="Ask away..."
        bind:value={query}
        bind:disabled={isQuerying}
      />

      <Button class="h-12" bind:disabled={isQuerying} on:click={makeQuery}>
        Submit
      </Button>
    </span>

    {#if reply}
      <div
        class="dark:bg-background bg-white flex p-2 border-b-[1px] justify-between items-center w-full rounded-2xl"
      >
        {#each reply?.choices as replyChoice}
          <p>{replyChoice.message.content}</p>
        {/each}
      </div>
    {/if}
  {:else}
    {progressText}
  {/if}
</div>
