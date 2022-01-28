import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { AudioPlayerStatus, AudioResource } from '@discordjs/voice'
import { Command } from '../../types'
import { Track } from './helpers/track'

const queue: Command = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription("See what's playing"),

    async execute(interaction: CommandInteraction) {
        if (globalThis.subscription) {
            let nowPlaying: string
            if (globalThis.subscription.audioPlayer.state.status === AudioPlayerStatus.Idle) {
                nowPlaying = 'Not playing anything atm'
            } else {
                const metadata = (globalThis.subscription.audioPlayer.state.resource as AudioResource<Track>).metadata
                nowPlaying = `Currently playing **[${metadata.title}](${metadata.url})**`
            }

            const queueFields = globalThis.subscription.queue.slice(0, 10)
                .map((track, i) => `❤️ ${i + 1}. [${track.title}](${track.url})`)
                .join('\n')

            await interaction.reply({
                embeds: [
                    {
                        color: '#ff006c',
                        title: 'Now playing 🎵😜😳',
                        description: nowPlaying,
                        fields: [{ name: 'This is pretty cool', value: queueFields }]
                    }
                ]
            })
        } else {
            await interaction.reply('?')
        }
    }
}

export default queue
