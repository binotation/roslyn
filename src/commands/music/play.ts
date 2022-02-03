import { CommandInteraction, GuildMember, VoiceBasedChannel } from 'discord.js'
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'
import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../../types'
import { MusicSubscription } from './helpers/subscription'
import { Track } from './helpers/track'
import axios from 'axios'

const port = require('../../../config.json').port

const play: Command = {
    data: new SlashCommandBuilder()
        .setName('p')
        .setDescription('Play music: enter youtube link or track title')
        .addStringOption(option => option.setName('track').setDescription('youtube link or track title').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        await interaction.deferReply()

        // Create subscription if none
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

            if (!globalThis.subscription) {
                await interaction.followUp('join a channel idiot')
                return
            } else {
                try {
                    await entersState(globalThis.subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3)
                } catch (error) {
                    console.warn(error)
                    await interaction.followUp('Failed to join voice channel (20s timeout), please try again later')
                    return
                }
            }
        }

        // Create Track and enqueue
        const track = interaction.options.getString('track')!

        const resp = await axios.get(`http://localhost:${port}?track="${track}"`)
        const respBody: { url: string, title: string } = resp.data

        if (resp.status === 200) {
            try {
                const track = await Track.from(respBody.url, respBody.title, {
                    onStart() {
                        interaction.channel?.send({ content: `Now playing **[${track.title}](${track.url})**` }).catch(console.warn)
                    },
                    onError(err: Error) {
                        interaction.channel?.send({ content: `Error: ${err.message}` }).catch(console.warn)
                    }
                })

                globalThis.subscription.enqueue(track)
                await interaction.followUp(`Added **${track.url}**`)
            } catch (error) {
                console.warn(error)
                await interaction.followUp(`Failed to play track, please try again later`)
            }
        } else {
            await interaction.followUp('Song could not be found')
        }
    }
}

export default play
