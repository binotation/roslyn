import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Tell me to leave'),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            globalThis.subscription.voiceConnection.destroy()
            globalThis.subscription = null
            await interaction.reply({ content: 'Bye ^^', ephemeral: true })
        } else {
            await interaction.reply({ content: '?', ephemeral: true })
        }
    }
}
