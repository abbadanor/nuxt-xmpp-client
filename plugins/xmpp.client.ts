import * as XMPP from 'stanza'
import { useXmppStore } from '~~/stores/xmpp'

export default defineNuxtPlugin(() => {
  const xmppStore = useXmppStore()
  let client: XMPP.Agent

  function connect() {
    client = XMPP.createClient({
      jid: 'adam@chat.a-nord.se',
      password: 'password',
      allowResumption: false,
      resource: 'nuxtclient',
      transports: {
        bosh: false,
        websocket: 'wss://chat.a-nord.se/xmpp-websocket',
      },
    })

    client.on('*', (name: string, data: any) => {
      if (data) {
        if (typeof (data) === 'string') {
          console.debug(name, data)
        }
        else if (typeof (data) === 'object') {
          console.debug(name, JSON.stringify(data))
        }
      }
    })

    client.on('session:started', async () => {
      console.log('Enabling carbons...')
      try {
        await client.enableCarbons()
      }
      catch {
        console.log('Server does not support carbons')
      }

      const roster = await client.getRoster()

      // fetch latest message from each roster item
      for (const item of roster.items) {
        await fetchArchive(item.jid, 1)
      }

      xmppStore.roster = roster.items.map((item) => {
        return {
          jid: item.jid,
          archiveFetched: false,
        }
      })

      client.updateCaps()
      client.sendPresence({
        legacyCapabilities: client.disco.getCaps(),
      })
      await client.discoverICEServers()
    })

    client.connect()
  }

  async function fetchArchive(jid: string, max = 500) {
    const opts: XMPP.MAMQueryOptions = {
      with: jid,
    }
    if (max) {
      opts.paging = {
        max,
        before: '',
      }
    }
    const { results } = await client.searchHistory('adam@chat.a-nord.se', opts)

    if (!results || results.length === 0) {
      return
    }

    const messages = []

    for (const { item } of results) {
      if (!item.message || item.message.type !== 'chat') {
        continue
      }
      if (xmppStore.messages.find(msg => msg.id === item.message?.id)) {
        continue
      }
      const { id, body, from, to } = item.message
      const time = item.delay?.timestamp

      if (!id || !body || !time || !to) {
        console.log(item.message)
        console.log(time)
        continue
      }
      messages.push({
        id,
        body,
        time,
        to: to.split('/')[0],
        from: from?.split('/')[0],
      })
    }

    if (messages.length > 0) {
      xmppStore.messages = xmppStore.messages.concat(messages)
    }
  }

  return {
    provide: {
      xmpp: {
        connect,
        fetchArchive,
      },
    },
  }
})
