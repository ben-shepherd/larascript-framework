import CommandEmptyArgument from "../exceptions/CommandEmptyArgument";
import CommandNotFoundException from "../exceptions/CommandNotFoundException";
import { ICommandReader } from "../interfaces/ICommandReader";
import CommandArguementParser, { ParsedArgumentsArray } from "../parsers/CommandArgumentParser";
import CommandRegister from "./CommandRegister";

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
        console.log('[CommandReader:ctor]', argv)
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

        const signature = this.argv[0] ?? null;

        if(!signature) {
            throw new CommandNotFoundException(`Invalid signature: ${signature}`);
        }

        console.log('[CommandReader:handle]', this.argv)

        const commandCtor = CommandRegister.getInstance().getBySignature(signature);

        if(!commandCtor) {
            throw new CommandNotFoundException()
        }

        console.log('[CommandReader:handle] executing', commandCtor, this.parsedArgs)

        const cmd = new commandCtor()
        cmd.setParsedArguments(this.runParser())
        cmd.execute()
    }
}