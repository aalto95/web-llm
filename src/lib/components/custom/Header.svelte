<script lang="ts">
  import { Moon, Sparkles, Sun } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import { toggleMode } from "mode-watcher";
</script>

<header
  class="dark:bg-background bg-indigo-50 flex py-2 px-8 border-b-[1px] justify-between items-center w-full fixed"
>
  <Sparkles />
  <Button on:click={toggleMode} variant="outline" size="icon">
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
</header>
