<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { InfoIcon } from 'lucide-vue-next';
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger class="absolute right-4 bottom-2 cursor-pointer">
      <InfoIcon />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Usage notes</AlertDialogTitle>
        <AlertDialogDescription>
          1. Select a large language model in dropdown. <br />
          2. Wait for a model to load. If it was loaded before, wait for it to
          initialize from cash. <br />
          3. Start querying.
        </AlertDialogDescription>
        <AlertDialogDescription>
          You can also access the history of chats using sidebar on the left.
          The history is local and resides directly in a browser.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>Okay</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
