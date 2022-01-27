import { CommandInteraction, GuildMember, VoiceBasedChannel } from 'discord.js'
import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'
import { SlashCommandBuilder } from '@discordjs/builders'
import { MusicSubscription } from './subscription'
import { Track } from './track'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music')
        .addStringOption(option => option.setName('url').setDescription('url of song').setRequired(true)),

    async execute(interaction: CommandInteraction) {

        await interaction.deferReply()

        const url = interaction.options.get('url')!.value as string ?? ''

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
            await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later')
            return
        }

        try {
            const track = await Track.from(url, {
                onStart() {
                    interaction.followUp({ content: 'Now playing!', ephemeral: true, }).catch(console.warn)
                },
                onFinish() {
                    interaction.followUp({ content: 'Now finished!', ephemeral: true }).catch(console.warn)
                },
                onError(err: Error) {
                    interaction.followUp({ content: `Error: ${err.message}`, ephemeral: true }).catch(console.warn)
                }
            })

            globalThis.subscription.enqueue(track)
            await interaction.followUp(`Enqueued **${track.url}**`)
        } catch (error) {
            console.warn(error)
            await interaction.followUp(`Failed to play track, please try again later!`)
        }
    }
}