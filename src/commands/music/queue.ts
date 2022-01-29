import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'
import createQueueEmbed from './helpers/createQueueEmbed'

const queue: Command = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription("See what's playing"),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            const queueEmbed = createQueueEmbed(globalThis.subscription)
            await interaction.reply({ embeds: [queueEmbed] })
        } else {
            await interaction.reply('?')
        }
    }
}

export default queue
