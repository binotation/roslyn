import { Collection } from 'discord.js'

const flirt = require('./flirt')
const play = require('./music/play')

const commands = new Collection<string, any>()
commands.set(flirt.data.name, flirt)
commands.set(play.data.name, play)

export default commands
