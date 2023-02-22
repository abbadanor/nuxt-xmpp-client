import { defineStore } from 'pinia'

export interface Message {
  id: string
  body: string
  time: Date
  from?: string
  to: string
}

interface XmppState {
  roster: {
    jid: string
    archiveFetched: boolean
  }[]
  messages: Message[]
}

export const useXmppStore = defineStore('xmpp', {
  state: (): XmppState => {
    return {
      roster: [],
      messages: [],
    }
  },
  getters: {
    sortedMessages: state => state.messages.sort((x, y) => y.time.getTime() - x.time.getTime()),
  },
})
