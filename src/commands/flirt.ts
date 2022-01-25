import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flirt')
        .setDescription('Test me'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Hey you ;)')
    }
}
