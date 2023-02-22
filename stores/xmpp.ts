import { defineStore } from 'pinia'

interface XmppState {
  roster: {
    jid: string
    archiveFetched: boolean
  }[]
  messages: {
    id: string
    body: string
    time: Date
    from?: string
    to: string
  }[]
}

export const useXmppStore = defineStore('xmpp', {
  state: (): XmppState => {
    return {
      roster: [],
      messages: [],
    }
  },
  getters: {
    sortedMessages: state => state.messages.sort((x, y) => x.time.getTime() - y.time.getTime()),
  },
})
