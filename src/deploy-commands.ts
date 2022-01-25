import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { getCommands } from './helpers'

const { clientId, token, guildId } = require('../config.json')

const commands = getCommands().map(command => command.data.toJSON())

const rest = new REST().setToken(token)
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Registered application commands.'))
    .catch(console.error)
