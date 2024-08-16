import { KeyPair, ParsedArgumentsArray } from '@src/core/domains/console/parsers/CommandArgumentParser';
import BaseMakeCommand, { targetDirectories } from '@src/core/domains/make/base/BaseMakeCommand';
import MakeCmdCommand from '@src/core/domains/make/commands/MakeCmdCommand';
import MakeListenerCommand from '@src/core/domains/make/commands/MakeListenerCommand';
import MakeModelCommand from '@src/core/domains/make/commands/MakeModelCommand';
import MakeObserverCommand from '@src/core/domains/make/commands/MakeObserverCommand';
import MakeProviderCommand from '@src/core/domains/make/commands/MakeProviderCommand';
import MakeRepositoryCommand from '@src/core/domains/make/commands/MakeRepositoryCommand';
import MakeRoutesCommand from '@src/core/domains/make/commands/MakeRoutesCommand';
import MakeServiceCommand from '@src/core/domains/make/commands/MakeServiceCommand';
import MakeSingletonCommand from '@src/core/domains/make/commands/MakeSingletonCommand';
import MakeSubscriberCommand from '@src/core/domains/make/commands/MakeSubscriberCommand';

export type CommandCtor<T extends BaseMakeCommand = BaseMakeCommand> = new (...args: any[]) => T;

/**
 * Get array of command types
 * e.g. Provider, Model, Repository etc.
 * 
 * @returns 
 */
const getArrayOfCommandTypes = (): string[] => {
    return Object.keys(targetDirectories)
}

/**
 * Generate parsed arguments
 * 
 * @param fileName 
 * @param collectionName 
 * @returns 
 */
const getParsedArguments = (fileName: string, collectionName: string): ParsedArgumentsArray => 
{
    return [
        {
            type: KeyPair,
            key: 'name',   
            value: fileName
        },
        {
            type: KeyPair,
            key: 'collection',   
            value: collectionName
        }
    ];
}

/**
 * Get command constructor by type
 * 
 * @param type 
 * @returns 
 */
const getCommandCtorByType = (type: typeof targetDirectories[string]): CommandCtor => {
    switch(type) {
        case 'Repository':
            return MakeRepositoryCommand;
        case 'Model':
            return MakeModelCommand;
        case 'Listener':
            return MakeListenerCommand;
        case 'Subscriber':
            return MakeSubscriberCommand;
        case 'Service':
            return MakeServiceCommand;
        case 'Singleton':
            return MakeSingletonCommand;
        case 'Command':
            return MakeCmdCommand;
        case 'Observer':
            return MakeObserverCommand;
        case 'Provider':
            return MakeProviderCommand;
        case 'Routes':
            return MakeRoutesCommand;
        default:
            throw new Error('Unknown command type')
    }
}

export default Object.freeze({
    getArrayOfCommandTypes,
    getParsedArguments,
    getCommandCtorByType
});