import { Interaction } from 'discord.js'
import commands from '../commands/commands'

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction: Interaction) {
        if (!interaction.isCommand()) return

        const { commandName } = interaction

        await commands.get(commandName).execute(interaction)
    }
}
