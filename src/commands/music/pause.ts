import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'

const pause: Command = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause'),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            globalThis.subscription.audioPlayer.pause()
            await interaction.reply({ content: 'Paused' })
        } else {
            await interaction.reply({ content: '?', ephemeral: true })
        }
    }
}

export default pause
