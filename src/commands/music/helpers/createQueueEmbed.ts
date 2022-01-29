import { MessageEmbedOptions } from 'discord.js'
import { AudioPlayerStatus, AudioResource } from '@discordjs/voice'
import { MusicSubscription } from './subscription'
import { Track } from './track'

export default function createQueueEmbed(subscription: MusicSubscription): MessageEmbedOptions {
    let nowPlaying: string

    if (subscription.audioPlayer.state.status === AudioPlayerStatus.Idle) {
        nowPlaying = 'Not playing anything atm'
    } else {
        const metadata = (subscription.audioPlayer.state.resource as AudioResource<Track>).metadata
        nowPlaying = `Currently playing **[${metadata.title}](${metadata.url})**`
    }

    const queueFields = subscription.queue.slice(0, 10)
        .map((track, i) => `❤️ ${i + 1}. [${track.title}](${track.url})`)
        .join('\n')

    return {
        color: '#ff006c',
        title: 'Now playing 🎵😜😳',
        description: nowPlaying,
        fields: !queueFields ? undefined : [{ name: 'This is pretty cool', value: queueFields }]
    }
}
