import { Collection } from 'discord.js'
import { Command } from './types'

import flirt from './commands/flirt'

// Music commands
import play from './commands/music/play'
import skip from './commands/music/skip'
import leave from './commands/music/leave'
import queue from './commands/music/queue'
import pause from './commands/music/pause'
import resume from './commands/music/resume'
import remove from './commands/music/remove'
import jump from './commands/music/jump'

const commands = new Collection<string, Command>()
commands.set(flirt.data.name, flirt)
commands.set(play.data.name, play)
commands.set(skip.data.name, skip)
commands.set(leave.data.name, leave)
commands.set(queue.data.name, queue)
commands.set(pause.data.name, pause)
commands.set(resume.data.name, resume)
commands.set(remove.data.name, remove)
commands.set(jump.data.name, jump)

export default commands
