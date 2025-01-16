<script lang="ts">
  import Header from "$lib/components/custom/Header.svelte";
  import MainInput from "$lib/components/custom/MainInput.svelte";
  import { ModeWatcher } from "mode-watcher";
</script>

<main class="dark:bg-gray-900 bg-indigo-50 w-screen h-dvh overflow-x-hidden">
  <Header />
  <div class="w-full h-dvh pt-14 flex flex-col justify-center items-center">
    <MainInput />
  </div>

  <ModeWatcher />
</main>
