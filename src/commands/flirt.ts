import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types'

const flirt: Command = {
    data: new SlashCommandBuilder()
        .setName('flirt')
        .setDescription('Test me'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Hey you ;)')
    }
}

export default flirt
