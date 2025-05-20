<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { useChatsStore } from '@/stores';
import { MoreHorizontal, Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const chatsStore = useChatsStore();
const router = useRouter();

function deleteChat(chatId: string) {
  if (chatsStore.currentChat?.id === chatId) {
    router.push('/');
  }
  chatsStore.deleteChat(chatId);
}
</script>

<template>
  <Sidebar variant="sidebar">
    <SidebarContent>
      <RouterLink to="/" class="m-4">
        <Button class="cursor-pointer w-full"><Plus />New chat</Button>
      </RouterLink>
      <SidebarGroup
        v-for="modelOption in chatsStore.modelOptions"
        :key="modelOption.value"
      >
        <SidebarGroupLabel
          v-if="chatsStore.getChatsOfModel(modelOption.value).length"
          >{{ modelOption.value }}</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="chat in chatsStore.getChatsOfModel(modelOption.value)"
              :key="chat.title"
            >
              <SidebarMenuButton asChild>
                <RouterLink :to="'/chats/' + chat.id">
                  <span>{{ chat.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuItem @click="deleteChat(chat.id)">
                    <span>Delete Chat</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
