import ExampleCommand from '@src/app/commands/ExampleCommand';
import { ICommandConstructor } from '@src/core/domains/console/interfaces/ICommand';

/**
 * Register your custom commands here.
 * Commands will be available through the CLI using:
 * yarn dev <command-name> --args
 */
const commandsConfig: ICommandConstructor[] = [
    ExampleCommand,
]

export default commandsConfig;
