<script lang="ts">
  import Header from "$lib/components/custom/Header.svelte";
  import Main from "$lib/pages/Main.svelte";
  import { ModeWatcher } from "mode-watcher";
</script>

<main class="dark:bg-gray-900 bg-indigo-50 w-screen h-dvh overflow-x-hidden">
  <Header />
  <Main />
  <ModeWatcher />
</main>
