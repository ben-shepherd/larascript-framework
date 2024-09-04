import CommandNotFoundException from "@src/core/domains/console/exceptions/CommandNotFoundException";
import CommandSignatureInvalid from "@src/core/domains/console/exceptions/CommandSignatureInvalid";
import { ICommandReader } from "@src/core/domains/console/interfaces/ICommandReader";
import CommandArguementParser, { ParsedArgumentsArray } from "@src/core/domains/console/parsers/CommandArgumentParser";
import CommandRegister from "@src/core/domains/console/service/CommandRegister";
import { App } from "@src/core/services/App";

export default class CommandReader implements ICommandReader {
    private argv: string[] = [];

    /**
     * Command signature
     * 
     *  Example:
     *      my:command --id=123 --name="My Name"
     * 
     * @param argv 
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

        if(!signature) {
            throw new CommandNotFoundException();
        }

        const commandCtor = CommandRegister.getInstance().getBySignature(signature);

        if(!commandCtor) {
            throw new CommandSignatureInvalid()
        }

        const cmdConfig = App.container('console').register().getCommandConfig((new commandCtor).signature);

        const cmd = new commandCtor(cmdConfig)

        cmd.setParsedArguments(this.runParser())
        await cmd.execute()

        if(!cmd.keepProcessAlive) {
            process.exit(0)
        }
    }
}