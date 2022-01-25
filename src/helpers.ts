import { readdirSync } from 'fs'
import { Collection } from 'discord.js'
import { join } from 'path'

export function getCommands(): Collection<string, any> {
    const commands = new Collection<string, any>()
    const commandsDir = join(__dirname, './commands/')
    const commandFiles = readdirSync(commandsDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'))

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        commands.set(command.data.name, command)
    }

    return commands
}
