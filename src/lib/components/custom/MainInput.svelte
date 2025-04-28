<script lang="ts">
  import type {
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
    InitProgressReport,
  } from "@mlc-ai/web-llm";
  import Button from "../ui/button/button.svelte";
  import Input from "../ui/input/input.svelte";
  import { inference } from "$lib/inference";

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

  function selectModel(e: Event) {
    const model = (e.target as HTMLSelectElement).value;
    initLLM(model)
      .then(() => {
        isInitializing = false;
      })
      .catch((error) => {
        alert(error);
      });
  }
</script>

<div class="w-full flex flex-col h-full mt-20">
  <select class="mb-4" on:change={selectModel}>
    <option disabled selected value> -- Select LLM -- </option>
    {#each options as option}
      <option value={option.value}>{option.value}</option>
    {/each}
  </select>
  {#if !isInitializing}
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
