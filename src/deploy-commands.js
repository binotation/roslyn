const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, token, guildId } = require('../config.json')

const commands = [
    new SlashCommandBuilder().setName('test').setDescription('Test command.')
]
    .map(command => command.toJSON())

const rest = new REST().setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Registered application commands.'))
    .catch(console.error)
