import { Client, Intents } from 'discord.js'
import events from './events'

const { token } = require('../config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

// Attach event handlers
for (const event of events) {
    if (event[1].once) {
        client.once(event[0], (...args) => event[1].execute(...args))
    } else {
        client.on(event[0], (...args) => event[1].execute(...args))
    }
}

client.login(token)
