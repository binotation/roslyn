import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command, RepeatMode } from '../../types'

const repeat: Command = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Repeat queue or track')
        .addStringOption(option => option
            .setName('option')
            .setDescription('Repeat queue or repeat track')
            .addChoices([
                [RepeatMode.RepeatQueue, RepeatMode.RepeatQueue],
                [RepeatMode.RepeatTrack, RepeatMode.RepeatTrack],
                [RepeatMode.Normal, RepeatMode.Normal]
            ])
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            const option = interaction.options.getString('option')! as RepeatMode
            globalThis.subscription.flags.repeatMode = option
            await interaction.reply({ content: `Repeating ${option}` })
        } else {
            await interaction.reply({ content: '?', ephemeral: true })
        }
    }
}

export default repeat
