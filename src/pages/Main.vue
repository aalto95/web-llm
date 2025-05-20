<script setup lang="ts">
import InfoDialog from '@/components/custom/InfoDialog.vue';
import MainInput from '@/components/custom/MainInput.vue';
import { useChatsStore } from '@/stores';

const chatsStore = useChatsStore();
</script>

<template>
  <MainInput></MainInput>
  <InfoDialog v-if="!chatsStore.currentChat"></InfoDialog>
</template>
