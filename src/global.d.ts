import { MusicSubscription } from './commands/music/helpers/subscription'

declare global {
    var subscription: MusicSubscription | null = null
}
