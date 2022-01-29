import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'

const resume: Command = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume'),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            globalThis.subscription.audioPlayer.unpause()
            await interaction.reply({ content: '👍' })
        } else {
            await interaction.reply({ content: '?', ephemeral: true })
        }
    }
}

export default resume
