import { Collection } from 'discord.js'
import { Event } from './types'

import ready from './events/ready'
import interactionCreate from './events/interactionCreate'

const events = new Collection<string, Event>()
events.set(ready.name, ready)
events.set(interactionCreate.name, interactionCreate)

export default events
