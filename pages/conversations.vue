<script setup lang="ts">
import { useXmppStore } from '~~/stores/xmpp'
const { $xmpp } = useNuxtApp()
const xmppStore = useXmppStore()
const loading = ref(false)

function getLastMessageWithJid(jid: string) {
  return xmppStore.sortedMessages.find((msg) => {
    return msg.to === jid || msg.from === jid
  })?.body
}
</script>

<template>
  <div class="flex min-h-screen ml-72">
    <!-- Side navigation -->
    <div class="fixed top-0 left-0 z-10 flex flex-col justify-between h-screen p-2 bg-gray-100 border-r border-gray-200 w-72">
      <div>
        <NuxtLink to="/" class="mb-2 text-xs text-gray-500">
          Dina chatter
        </NuxtLink>
        <div v-if="xmppStore.roster.length > 0 && !loading">
          <div
            v-for="user in xmppStore.roster"
            :key="user.jid"
            class="flex p-2 mb-2 rounded-md cursor-pointer"
            :class="$route.params.username === user.jid.split('@')[0] ? 'bg-white shadow-sm' : ''"
            @click="$router.push(`/conversations/${user.jid.split('@')[0]}`)"
          >
            <img class="self-center w-8 h-8 mr-2 border-2 border-gray-200 rounded-full" :src="`https://avatar.tobi.sh/${user.jid.split('@')[0]}`" alt="Profile pic">
            <div class="min-w-0">
              <div class="text-sm capitalize">
                {{ user.jid.split('@')[0] }}
              </div>
              <div class="overflow-hidden text-xs text-gray-700 whitespace-nowrap overflow-ellipsis">
                {{ getLastMessageWithJid(user.jid) }}
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div
            v-for="i in 3"
            :key="i"
            class="flex p-2 mb-2"
          >
            <div class="self-center w-8 h-8 mr-2 bg-gray-200 rounded-full shrink-0 animate-pulse" />
            <div class="flex flex-col justify-between w-full h-9">
              <div class="h-5 bg-gray-200 rounded-md animate-pulse" />
              <div class="h-3 text-xs bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <Icon class="w-6 h-6 mt-2 text-gray-500 cursor-pointer" name="ph:arrow-clockwise-bold" @click="loading = !loading" />
    </div>
    <!-- Page content -->
    <main class="flex flex-col w-full">
      <!-- <div class="fixed right-0 z-10 flex justify-end bg-gray-200 left-72">
        <Icon class="w-5 h-5 m-2 text-gray-900 cursor-pointer" icon="ph:video-camera-fill" />
        <Icon class="w-5 h-5 m-2 text-gray-900 cursor-pointer" icon="ph:phone-fill" />
      </div>
      <div v-if="filteredMessages.length > 0" class="flex flex-col justify-end w-full px-3 pt-12 pb-20">
        <ChatBubble v-for="m in filteredMessages" :key="m.id" :outgoing="m.to?.jid !== store.jid" :sender="m.from?.jid.split('@')[0] || m.to?.jid.split('@')[0]" :time="m.delay">
          {{ m.body }}
        </ChatBubble>
        <form class="fixed bottom-0 right-0 z-10 flex items-center p-3 bg-gray-200 border-t border-gray-300 left-72" @submit.prevent>
          <textarea v-model="chatBody" class="w-full rounded-md resize-none" name="hehe" rows="1" placeholder="Type a new message" />
          <Icon class="w-5 h-5 ml-2 text-gray-900 cursor-pointer" icon="ph:paper-plane-right-fill" @click="sendChat" />
        </form>
      </div> -->
      <NuxtPage />
    </main>
  </div>
</template>
