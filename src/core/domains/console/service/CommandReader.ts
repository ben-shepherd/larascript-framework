import CommandEmptyArgument from "@src/core/domains/Console/exceptions/CommandEmptyArgument";
import CommandNotFoundException from "@src/core/domains/Console/exceptions/CommandNotFoundException";
import { ICommandReader } from "@src/core/domains/Console/interfaces/ICommandReader";
import CommandArguementParser, { ParsedArgumentsArray } from "@src/core/domains/Console/parsers/CommandArgumentParser";
import CommandRegister from "@src/core/domains/Console/service/CommandRegister";

export default class CommandReader implements ICommandReader {
    private argv: string[] = [];
    private parsedArgs: ParsedArgumentsArray = [];
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
    handle() {
        if(!this.argv.length) {
            throw new CommandEmptyArgument();
        }

        const signature = this.argv[0];

        const commandCtor = CommandRegister.getInstance().getBySignature(signature);

        if(!commandCtor) {
            throw new CommandNotFoundException()
        }

        const cmd = new commandCtor()
        cmd.setParsedArguments(this.runParser())
        cmd.execute()
    }
}