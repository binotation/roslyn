import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'

const skip: Command = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip current track'),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            globalThis.subscription.audioPlayer.stop()
            await interaction.reply({ content: 'Thank u, next' })
        } else {
            await interaction.reply({ content: '?', ephemeral: true })
        }
    }
}

export default skip
