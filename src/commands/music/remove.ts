import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'
import createQueueEmbed from './helpers/createQueueEmbed'

const remove: Command = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove tracks')
        .addStringOption(option => option
            .setName('pattern')
            .setDescription('Example: "2, 5, 7-10"')
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const pattern = interaction.options.get('pattern')!.value as string
        if (globalThis.subscription) {
            globalThis.subscription.removeTracks(pattern)
            const queueEmbed = createQueueEmbed(globalThis.subscription)
            await interaction.reply({ content: '👍', embeds: [queueEmbed] })
        } else {
            await interaction.reply({ content: '?', ephemeral: true })
        }
    }
}

export default remove
