<script lang="ts">
  import type {
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
    InitProgressReport,
  } from "@mlc-ai/web-llm";
  import Button from "../ui/button/button.svelte";
  import Input from "../ui/input/input.svelte";
  import { onMount } from "svelte";
  import { inference } from "$lib/inference";

  let engine: inference.MLCEngine;
  let reply: inference.ChatCompletion;
  let query: string = "";
  let isInitializing = true;
  let isQuerying = false;
  let progressText = "";

  async function initLLM(): Promise<void> {
    const initProgressCallback = (initProgress: InitProgressReport) => {
      progressText = initProgress.text;
    };
    const selectedModel = "Qwen2-0.5B-Instruct-q0f32-MLC";

    engine = await inference.CreateMLCEngine(selectedModel, {
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

  onMount(() => {
    initLLM().then(() => {
      isInitializing = false;
    });
  });
</script>

<div class="w-full flex flex-col h-full mt-32">
  {#if !isInitializing}
    <h1 class="text-2xl lg:text-3xl xl:text-4xl text-center mb-8">
      Make your query
    </h1>
    <span class="flex gap-4">
      <Input
        class="w-full h-12 text-lg xl:text-xl"
        placeholder="Ask away..."
        bind:value={query}
        bind:disabled={isQuerying}
      />
      <Button class="h-12" bind:disabled={isQuerying} on:click={makeQuery}
        >Submit</Button
      >
    </span>

    {#if reply}
      <div
        class="dark:bg-background bg-indigo-50 flex py-2 px-8 border-b-[1px] justify-between items-center w-full rounded-2xl mt-8"
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
