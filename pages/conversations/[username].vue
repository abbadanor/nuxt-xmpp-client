<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useXmppStore } from '~~/stores/xmpp'
const xmppStore = useXmppStore()
const route = useRoute()
const { roster } = storeToRefs(xmppStore)
const chatContainer = ref<HTMLDivElement | null>(null)

// TODO: göra så time endast är ett prop om meddelandet är dagens första
const filteredMessages = computed(() => {
  return xmppStore.sortedMessages.filter(msg => msg.to.split('@')[0] === route.params.username || msg.from?.split('@')[0] === route.params.username)
})

function autoResize(event: Event) {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
  if (chatContainer.value) {
    chatContainer.value.style.paddingBottom = `${24 + target.scrollHeight}px`
  }
}

watch(roster, async (to, from) => {
  if (from.length !== 0) {
    return
  }
  const rosterItem = roster.value.find(item => item.jid.split('@')[0] === route.params.username)
  if (rosterItem && !rosterItem.archiveFetched) {
    const { $xmpp } = useNuxtApp()
    $xmpp.fetchArchive(rosterItem.jid)
    rosterItem.archiveFetched = true
  }
})

onMounted(() => {
  const rosterItem = xmppStore.roster.find(item => item.jid.split('@')[0] === route.params.username)
  if (rosterItem && !rosterItem.archiveFetched) {
    const { $xmpp } = useNuxtApp()
    $xmpp.fetchArchive(rosterItem.jid)
    rosterItem.archiveFetched = true
  }
})

// TODO: scroll to bottom somehow
</script>

<template>
  <div v-if="filteredMessages" ref="chatContainer" class="px-3 flex flex-col-reverse pb-16 pt-14">
    <div class="h-14 right-0 bg-gray-200 border-b border-gray-300 fixed top-0 left-72 justify-end items-center z-10 flex ">
      <Icon class="w-10 h-10 text-gray-800 p-2 rounded-full border border-gray-300 mr-2 hover:bg-gray-300 cursor-pointer" name="ph:phone-call-fill" />
      <Icon class="w-10 h-10 text-gray-800 p-2 rounded-full border border-gray-300 mr-2 hover:bg-gray-300 cursor-pointer" name="ph:video-camera-fill" />
    </div>
    <ChatBubble
      v-for="msg in filteredMessages" :key="msg.id"
      :sender="(msg.to === 'adam@chat.a-nord.se') ? msg.from?.split('@')[0] : undefined" :time="msg.time"
    >
      {{ msg.body }}
    </ChatBubble>
    <form class="fixed right-0 bottom-0 left-72 z-10 p-3 bg-gray-200 border-t border-gray-300 flex items-center" @submit.prevent>
      <textarea class="w-full rounded-md resize-none p-2" rows="1" placeholder="Type a new message" @input="autoResize" />
      <Icon class="h-5 w-5 ml-2 text-gray-900 cursor-pointer" name="ph:paper-plane-right-fill" />
    </form>
  </div>
</template>
