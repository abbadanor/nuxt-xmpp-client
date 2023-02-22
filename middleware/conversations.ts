// middleware:
// if [username] not in store:
//   redirect -> /conversations
// else
//   if !store.username.fetchedArchive:
//     fetchArchive(username)
//     store.username.fetchedArchive = true

import { useXmppStore } from '~~/stores/xmpp'

export default defineNuxtRouteMiddleware((to) => {
  const xmppStore = useXmppStore()
  const rosterItem = xmppStore.roster.find(item => item.jid.split('@')[0] === to.params.username)
  if (rosterItem && !rosterItem.archiveFetched) {
    const { $xmpp } = useNuxtApp()
    $xmpp.fetchArchive(rosterItem.jid)
    rosterItem.archiveFetched = true
  }
})
