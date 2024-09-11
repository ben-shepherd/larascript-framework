import ExampleCommand from '@src/app/commands/ExampleCommand';
import { ICommandConstructor } from '@src/core/domains/console/interfaces/ICommand';

/**
 * Add your comments to be registered in the ConsoleProvider
 */
const commandsConfig: ICommandConstructor[] = [
    ExampleCommand,
]

export default commandsConfig;
