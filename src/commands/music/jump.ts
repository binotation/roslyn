import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'
import createQueueEmbed from './helpers/createQueueEmbed'

const jump: Command = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jump queue to track #')
        .addIntegerOption(option => option.setName('tracknum').setDescription('Jump to track #num')),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            const trackNo = interaction.options.getInteger('tracknum')!
            globalThis.subscription.jumpQueue(trackNo)
            const queueEmbed = createQueueEmbed(globalThis.subscription)
            await interaction.reply({ content: `Jumped to track #${trackNo}`, embeds: [queueEmbed] })
        } else {
            await interaction.reply({ content: '?', ephemeral: true })
        }
    }
}

export default jump
