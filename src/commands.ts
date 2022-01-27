import { Collection } from 'discord.js'
import { Command } from './types'

import flirt from './commands/flirt'

// Music commands
import play from './commands/music/play'
import skip from './commands/music/skip'
import leave from './commands/music/leave'

const commands = new Collection<string, Command>()
commands.set(flirt.data.name, flirt)
commands.set(play.data.name, play)
commands.set(skip.data.name, skip)
commands.set(leave.data.name, leave)

export default commands
