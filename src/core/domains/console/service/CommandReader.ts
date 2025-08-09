import CommandNotFoundException from "@src/core/domains/console/exceptions/CommandNotFoundException";
import CommandSignatureInvalid from "@src/core/domains/console/exceptions/CommandSignatureInvalid";
import { ICommandReader } from "@src/core/domains/console/interfaces/ICommandReader";
import CommandArguementParser, { ParsedArgumentsArray } from "@src/core/domains/console/parsers/CommandArgumentParser";
import { app } from "@src/core/services/App";

export default class CommandReader implements ICommandReader {

    /**
     * Command signature
     * 
     *  Example:
            ["--id=123", "--name=\"My Name\""]
     */
    private readonly argv: string[] = [];

    /**
     * Command signature
     * 
     *  Example:
            ["my:command", "--id=123", "--name=\"My Name\""]
     */
    constructor(argv: string[]) {
        this.argv = argv;
    }

    /**
     * Parse the string commands into a readable format
     * and store them in this.parsedArgs
     */
    runParser(): ParsedArgumentsArray {
        const argvWithoutSignature = this.argv.splice(1)
        return CommandArguementParser.parseStringCommands(argvWithoutSignature);
    }

    /**
     * Read and execute command
     */
    async handle() {
        const signature = this.argv.length && this.argv[0];

        if (!signature) {
            throw new CommandNotFoundException();
        }

        const commandCtor = app('console').registerService().getBySignature(signature);

        if (!commandCtor) {
            throw new CommandSignatureInvalid()
        }

        const cmdConfig = app('console').registerService().getCommandConfig(signature);

        const cmd = new commandCtor()
        cmd.setConfig(cmdConfig);

        cmd.setParsedArguments(this.runParser())
        await cmd.execute()

        cmd.end();
    }

}