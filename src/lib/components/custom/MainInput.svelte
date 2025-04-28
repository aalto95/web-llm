<script lang="ts">
  import type {
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
  } from "@mlc-ai/web-llm";
  import Button from "../ui/button/button.svelte";
  import Input from "../ui/input/input.svelte";
  import * as webllm from "@mlc-ai/web-llm";

  let engine: webllm.MLCEngine;
  let reply: webllm.ChatCompletion & AsyncIterable<webllm.ChatCompletionChunk>;
  let query: string = "";
  let isQuerying = false;

  async function initLLM() {
    // Callback function to update model loading progress
    const initProgressCallback = (initProgress: any) => {
      console.log(initProgress);
    };
    const selectedModel = "Qwen2-0.5B-Instruct-q0f32-MLC";

    engine = await webllm.CreateMLCEngine(
      selectedModel,
      { initProgressCallback: initProgressCallback } // engineConfig
    );

    const messages: (
      | ChatCompletionSystemMessageParam
      | ChatCompletionUserMessageParam
    )[] = [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: "Hello!" },
    ];

    reply = await engine.chat.completions.create({
      messages,
    });

    console.log(reply.choices[0].message);
    console.log(reply.usage);
  }

  async function makeQuery() {
    console.log(query);
    isQuerying = true;
    reply = await engine.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: query },
      ],
    });
    query = "";
    isQuerying = false;

    console.log(reply.choices[0].message);
    console.log(reply.usage);
  }

  initLLM();
</script>

<div class="w-full flex flex-col h-full mt-32">
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
</div>
