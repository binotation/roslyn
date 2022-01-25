import { Client, Intents } from 'discord.js'
import { getCommands } from './helpers'

const { token } = require('../config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
    console.log('Ready')
})

const commands = getCommands()

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    await commands.get(commandName).execute(interaction)
})

client.login(token)
