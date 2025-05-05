<script setup lang="ts">
import Header from '@/components/custom/Header.vue';
import Sidebar from '@/components/custom/Sidebar.vue';
import SidebarProvider from '@/components/ui/sidebar/SidebarProvider.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <SidebarProvider :default-open="false">
    <Sidebar></Sidebar>
    <main class="w-screen h-dvh">
      <Header></Header>
      <RouterView></RouterView>
    </main>
  </SidebarProvider>
</template>
