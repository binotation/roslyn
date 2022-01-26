import { Collection } from "discord.js"

const ready = require('./ready')
const interactionCreate = require('./interactionCreate')

const events = new Collection<string, any>()
events.set(ready.name, ready)
events.set(interactionCreate.name, interactionCreate)

export default events
