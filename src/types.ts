import { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

export interface Event {
    name: string,
    once: boolean,
    execute(...args: any[]): Promise<void> | void
}

export interface Command {
    /* SlashCommandBuilder | SlashCommandBuilder with string option */
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    execute(interaction: CommandInteraction): Promise<void>
}

export enum RepeatMode {
    Normal = 'off',
    RepeatQueue = 'queue',
    RepeatTrack = 'track'
}
