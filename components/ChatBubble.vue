<script setup lang="ts">
const props = defineProps<{
  sender?: string
  time: Date
}>()

const { $dayjs } = useNuxtApp()
</script>

<template>
  <div class="grid py-1 bubble-grid gap-x-3" :class="sender ? 'place-items-start chat-start' : 'place-items-end chat-end'">
    <div v-if="sender" class="relative inline-flex self-end row-span-2" :class="sender ? 'col-start-1' : 'col-start-2'">
      <div class="block w-10 overflow-hidden rounded-full aspect-square">
        <img class="block object-cover w-full h-full max-w-full" :src="`https://avatar.tobi.sh/${sender}`">
      </div>
    </div>
    <div class="row-start-1 text-sm capitalize" :class="sender ? 'col-start-2' : 'col-start-1'">
      <time class="text-xs opacity-50">{{ $dayjs(time).fromNow() }}</time>
    </div>
    <div
      class="relative block px-4 py-2  bg-gray-200 chat-bubble max-w-lg w-fit rounded-2xl before:absolute before:bottom-0 before:h-3 before:w-3 before:bg-inherit"
      :class="sender ? 'before:-left-3 col-start-2 rounded-bl-none' : 'before:left-full col-start-1 rounded-br-none'"
    >
      <slot />
    </div>
    <div class="row-start-3 text-sm text-gray-600 opacity-50 chat-footer" :class="sender ? 'col-start-2' : 'col-start-1'" />
  </div>
</template>

<style scoped>
.chat-start {
  grid-template-columns: auto 1fr;
}

.chat-end {
  grid-template-columns: 1fr auto;
}

.chat-bubble::before {
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.chat-start .chat-bubble::before {
  mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMycgaGVpZ2h0PSczJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGZpbGw9J2JsYWNrJyBkPSdtIDAgMyBMIDMgMyBMIDMgMCBDIDMgMSAxIDMgMCAzJy8+PC9zdmc+);
}

.chat-end .chat-bubble::before {
  mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMycgaGVpZ2h0PSczJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGZpbGw9J2JsYWNrJyBkPSdtIDAgMyBMIDEgMyBMIDMgMyBDIDIgMyAwIDEgMCAwJy8+PC9zdmc+);
}

.chat-start + .chat-start .chat-bubble::before {
  display: none;
}

.chat-end + .chat-end .chat-bubble::before {
  display: none;
}

.bubble-grid:first-child .chat-footer::after {
  content: 'Delivered';
}

.chat-start + .chat-start {
  padding: 0;
}

.chat-end + .chat-end {
  padding: 0;
}

.chat-start + .chat-start .chat-bubble {
  border-bottom-left-radius: 1rem;
}

.chat-end + .chat-end .chat-bubble {
  border-bottom-right-radius: 1rem;
}

.chat-start + .chat-start img  {
  display: none;
}
</style>
