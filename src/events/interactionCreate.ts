import { Interaction } from 'discord.js'
import { Event } from '../types'
import commands from '../commands'

const interactionCreate: Event = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction: Interaction) {
        if (!interaction.isCommand()) return

        const { commandName } = interaction
        const command = commands.get(commandName)

        if (command !== undefined) await command.execute(interaction)
    }
}

export default interactionCreate
