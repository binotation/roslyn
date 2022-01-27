import { Client, Intents } from 'discord.js'
import { Snowflake } from 'discord-api-types'
import events from './events/events'
import { MusicSubscription } from './commands/music/subscription'

const { token } = require('../config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

globalThis.subscriptions = new Map<Snowflake, MusicSubscription>()

// Attach event handlers
for (const event of events) {
    if (event[1].once) {
        client.once(event[0], (...args) => event[1].execute(...args))
    } else {
        client.on(event[0], (...args) => event[1].execute(...args))
    }
}

client.login(token)
