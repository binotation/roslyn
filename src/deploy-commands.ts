import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import commands from './commands/commands'

const { clientId, token, guildId } = require('../config.json')

const commandsJson = commands.map(command => command.data.toJSON())

const rest = new REST().setToken(token)
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsJson })
	.then(() => console.log('Registered application commands.'))
	.catch(console.error)
