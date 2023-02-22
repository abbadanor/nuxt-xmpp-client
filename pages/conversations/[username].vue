<script setup lang="ts">
import { useXmppStore } from '~~/stores/xmpp'
const xmppStore = useXmppStore()
const route = useRoute()

const filteredMessages = computed(() => {
  return xmppStore.sortedMessages.filter(msg => msg.to.split('@')[0] === route.params.username || msg.from?.split('@')[0] === route.params.username)
})

watch(() => route, (to, from) => {
  console.log(to)
})

definePageMeta({
  middleware: ['conversations'],
})
</script>

<template>
  <div v-if="filteredMessages" class="w-full px-3 pt-12 pb-20 flex flex-col justify-end">
    <ChatBubble v-for="msg in filteredMessages" :key="msg.id" :sender="(msg.from?.split('@')[0] !== $route.params.username) ? msg.from?.split('@')[0] : undefined" :time="msg.time">
      {{ msg.body }}
    </ChatBubble>
    <!-- <form class="fixed right-0 bottom-0 left-72 z-10 p-3 bg-gray-200 border-t border-gray-300 flex items-center" @submit.prevent>
      <textarea v-model="chatBody" class="w-full rounded-md resize-none" name="hehe" rows="1" placeholder="Type a new message" />
      <Icon class="h-5 w-5 ml-2 text-gray-900 cursor-pointer" icon="ph:paper-plane-right-fill" @click="sendChat" />
    </form> -->
  </div>
</template>
