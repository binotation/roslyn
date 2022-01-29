import { CommandInteraction, GuildMember, VoiceBasedChannel } from 'discord.js'
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'
import { MusicSubscription } from './helpers/subscription'
import { Track } from './helpers/track'
const yts = require('yt-search')

const play: Command = {
    data: new SlashCommandBuilder()
        .setName('p')
        .setDescription('Play music: enter youtube link or track title')
        .addStringOption(option => option.setName('track').setDescription('youtube link or track title').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        await interaction.deferReply()
        const ytUrlRegex = /^(https:\/\/){0,1}(w{3}.|w{0})youtube.com\/watch\/{0,1}\?v=\w+.*$/i

        let url: string | undefined
        let title: string | undefined
        const track = interaction.options.get('track')!.value as string

        if (ytUrlRegex.test(track)) {
            url = track
            const params = new URLSearchParams(url.substring(url.indexOf('?') + 1))
            const v = await yts({ videoId: params.get('v') })
            title = v?.title
        } else {
            const r = await yts(track)
            const video = r?.videos[0]
            url = video?.url
            title = video?.title
        }

        if (!url || !title) {
            await interaction.reply('Song could not be found')
            return
        }

        if (!globalThis.subscription) {
            if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
                const channel: VoiceBasedChannel = interaction.member.voice.channel
                globalThis.subscription = new MusicSubscription(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator
                    })
                )

                globalThis.subscription.voiceConnection.on('error', console.warn)
            }
        }

        if (!globalThis.subscription) {
            await interaction.followUp('join a channel idiot')
            return;
        }

        try {
            await entersState(globalThis.subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3)
        } catch (error) {
            console.warn(error)
            await interaction.followUp('Failed to join voice channel (20s timeout), please try again later')
            return
        }

        try {
            const track = await Track.from(url, title, {
                onStart() {
                    interaction.followUp({ content: `Now playing ${track.title}` }).catch(console.warn)
                },
                onError(err: Error) {
                    interaction.followUp({ content: `Error: ${err.message}`, ephemeral: true }).catch(console.warn)
                }
            })

            globalThis.subscription.enqueue(track)
            await interaction.followUp(`Added **${track.url}**`)
        } catch (error) {
            console.warn(error)
            await interaction.followUp(`Failed to play track, please try again later`)
        }
    }
}

export default play
