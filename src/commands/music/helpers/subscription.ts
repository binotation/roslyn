import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioPlayerState,
    AudioResource,
    createAudioPlayer,
    AudioPlayerError,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionStatus,
    VoiceConnectionState
} from '@discordjs/voice'
import type { Track } from './track'
import { promisify } from 'node:util'

const wait = promisify(setTimeout)

export class MusicSubscription {
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;

    public queue: Track[]
    private queueLock = false
    private readyLock = false

    public constructor(voiceConnection: VoiceConnection) {
        this.voiceConnection = voiceConnection
        this.audioPlayer = createAudioPlayer()
        this.queue = []

        this.voiceConnection.on('stateChange', async (_: any, newState: VoiceConnectionState) => {

            if (newState.status === VoiceConnectionStatus.Disconnected) {

                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    // Wait for reconnect attempt
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000)
                    } catch {
                        this.voiceConnection.destroy()
                        globalThis.subscription = null
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    await wait((this.voiceConnection.rejoinAttempts + 1) * 5_000)
                    this.voiceConnection.rejoin()
                } else {
                    this.voiceConnection.destroy()
                    globalThis.subscription = null
                }

            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.stop()
            } else if (!this.readyLock &&
                (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)) {

                this.readyLock = true
                try {
                    await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000)
                } catch {
                    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy()
                } finally {
                    this.readyLock = false
                }
            }

        });

        this.audioPlayer.on('stateChange', (oldState: AudioPlayerState, newState: AudioPlayerState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                // From not idle to idle: track has finished playing
                this.processQueue()
            } else if (newState.status === AudioPlayerStatus.Playing) {
                (newState.resource as AudioResource<Track>).metadata.onStart()
            }
        })

        this.audioPlayer.on('error', (error: AudioPlayerError) => (error.resource as AudioResource<Track>).metadata.onError(error))
        voiceConnection.subscribe(this.audioPlayer)
    }

    public enqueue(track: Track) {
        this.queue.push(track)
        this.processQueue()
    }

    public removeTracks(pattern: string) {
        pattern = pattern.replaceAll(' ', '')
        const format = /(\d+-\d+,|\d+,)*(\d+-\d+|\d+),{0,1}/

        if (format.test(pattern)) {
            const patternArr = pattern.split(',')

            for (const cell of patternArr) {
                if (cell.includes('-')) {
                    const rangeArr = cell.split('-') as any[]
                    for (let i = Math.min(...rangeArr); i <= Math.max(...rangeArr); i++) {
                        delete this.queue[i - 1]
                    }
                } else {
                    delete this.queue[Number(cell) - 1]
                }
            }

            this.queue = this.queue.filter(track => track !== undefined)
        }
    }

    public jumpQueue(track: number) {
        this.queue = this.queue.concat(this.queue.splice(0, track - 1))
        this.audioPlayer.stop()
    }

    public stop() {
        this.queueLock = true
        this.queue = []
        this.audioPlayer.stop(true)
    }

    private async processQueue(): Promise<void> {
        if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
            return
        }
        this.queueLock = true
        const nextTrack = this.queue.shift()!
        this.queue.push(nextTrack)

        try {
            const resource = await nextTrack.createAudioResource()
            this.audioPlayer.play(resource)
            this.queueLock = false
        } catch (error) {
            nextTrack.onError(error as Error)
            this.queueLock = false
            return this.processQueue()
        }
    }
}
