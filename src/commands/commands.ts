import { Collection } from 'discord.js'

const flirt = require('./flirt')
const play = require('./music/play')
const skip = require('./music/skip')
const leave = require('./music/leave')

const commands = new Collection<string, any>()
commands.set(flirt.data.name, flirt)
commands.set(play.data.name, play)
commands.set(skip.data.name, skip)
commands.set(leave.data.name, leave)

export default commands
