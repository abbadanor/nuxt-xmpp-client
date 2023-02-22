<script setup>
const { $xmpp } = useNuxtApp()
onMounted(() => {
  $xmpp.connect()
})
</script>

<template>
  <NuxtPage />
</template>
