<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Moon, SidebarOpenIcon, Sparkles, Sun } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useSidebar } from '../ui/sidebar';

const isDarkMode = ref(true);
const { toggleSidebar } = useSidebar();

function toggleTheme(): void {
  isDarkMode.value = !isDarkMode.value;

  // Update the HTML class based on the new state
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark'); // Save the preference
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light'); // Save the preference
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <header
    class="dark:bg-background bg-white z-10 flex py-2 px-4 border-b-[1px] justify-between items-center w-full fixed"
  >
    <span class="flex items-center gap-4">
      <Button variant="outline" size="icon" @click="toggleSidebar">
        <SidebarOpenIcon></SidebarOpenIcon>
      </Button>
      <RouterLink to="/">
        <Sparkles />
      </RouterLink>
    </span>

    <Button @click="toggleTheme" variant="outline" size="icon">
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
  </header>
</template>
