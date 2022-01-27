import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current track'),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            globalThis.subscription.audioPlayer.stop()
            await interaction.reply({ content: 'Skipped song', ephemeral: true })
        } else {
            await interaction.reply({ content: 'Not currently playing', ephemeral: true })
        }
    }
}
