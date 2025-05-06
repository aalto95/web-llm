<script setup lang="ts">
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
import { MoreHorizontal } from 'lucide-vue-next';
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
      <SidebarGroup>
        <SidebarGroupLabel>Chats</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="chat in chatsStore.chats" :key="chat.title">
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
