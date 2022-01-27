import { Snowflake } from 'discord-api-types'
import { MusicSubscription } from './commands/music/subscription'

declare global {
    var subscription: MusicSubscription | null = null
}
