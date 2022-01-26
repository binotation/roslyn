import { Collection } from 'discord.js'

const flirt = require('./flirt')

const commands = new Collection<string, any>()
commands.set(flirt.data.name, flirt)

export default commands
