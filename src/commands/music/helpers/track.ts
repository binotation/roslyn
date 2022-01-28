import { AudioResource, createAudioResource, demuxProbe } from '@discordjs/voice'
import { exec as ytdlExec } from 'youtube-dl-exec'

const noop = () => { }

export interface TrackData {
    url: string,
    title: string,
    onStart: () => void,
    onError: (err: Error) => void,
}

export class Track implements TrackData {
    public readonly url: string
    public readonly title: string
    public readonly onStart: () => void
    public readonly onError: (err: Error) => void

    private constructor({ url, title, onStart, onError }: TrackData) {
        this.url = url
        this.title = title
        this.onStart = onStart
        this.onError = onError
    }

    public static async from(url: string, title: string, methods: Pick<Track, 'onStart' | 'onError'>): Promise<Track> {
        // Wrap methods to ensure they are called only once
        const wrappedMethods = {
            onStart() {
                wrappedMethods.onStart = noop
                methods.onStart()
            },
            onError(err: Error) {
                wrappedMethods.onError = noop
                methods.onError(err)
            }
        };

        return new Track({ url, title, ...wrappedMethods })
    }

    public createAudioResource(): Promise<AudioResource<Track>> {
        return new Promise((resolve, reject) => {
            const process = ytdlExec(
                this.url,
                {
                    output: '-',
                    quiet: true,
                    format: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio'
                },
                { stdio: ['ignore', 'pipe', 'ignore'] }
            );

            if (!process.stdout) {
                reject(new Error('No stdout'));
                return;
            }
            const stream = process.stdout

            process.once('spawn', () => {
                demuxProbe(stream)
                    .then((probe: { stream: any, type: any }) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
                    .catch((err: Error) => {
                        if (!process.killed) process.kill()
                        stream.resume()
                        reject(err)
                    })
            })
        })
    }
}
