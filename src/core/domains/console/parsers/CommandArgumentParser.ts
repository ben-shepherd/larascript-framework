import CommandArguementParserException from "@src/core/domains/console/exceptions/CommandArguementParserException"

export const KeyPair = 'KeyPair'
export type KeyPairArguementType = {type: typeof KeyPair, key: string, value: string}

export const OnlyArguement = 'OnlyValue'
export type OnlyArguementType = {type: typeof OnlyArguement, value: string}

export type ParsedArguement = OnlyArguementType | KeyPairArguementType
export type ParsedArgumentsArray = Array<ParsedArguement>

export default class CommandArguementParser {

    /**
     * Parse the string commands into a readable format and store them
     * in this.parsedArgs
     * 
     * Example
     *      commandArguements = [
     *          '--myArguement',
     *          '--myArguementWithValue="123"
     *      ]
     * 
     * Returns 
     *      [
     *          {type: OnlyArg, value: 'myArguement'},
     *          {type: KeyPairArg, value: 'myArguementWithValue'}
     *      ]
     */
    public static parseStringCommands(commands: string[]): ParsedArgumentsArray {
        const parsedCommands: ParsedArgumentsArray = []

        for(const command of commands) {
            const parsed = this.parse(command)

            if(parsed) {
                parsedCommands.push(parsed)
            }
        }

        return parsedCommands
    }

    /**
     * Parses command arguments into a readable format
     * 
     *  Examples
     *      --myArgument 
     *      // Outputs: {type: OnlyArg, value: 'myArgument'}
     * 
     *      --myAruementWithValue="my value" /
     *      // Outputs: {type: KeyPairArg, value: 'myArgument'}
     * 
     * @param command 
     * @returns 
     */
    public static parse(command: string): ParsedArguement | null {
        if(!command.startsWith('--')) {
            throw new CommandArguementParserException(`Invalid command argment: '${command}'. Did you forget to prefix with --?`)
        }

        const regExp = new RegExp(/^--([^=]+)(=|\s)"?([^"]+)"?$/)
        const matches = regExp.exec(command)

        if(matches?.[1] && matches?.[3]) {
            const keyWithoutDashes = matches[1].replace('--', '');
            const value = matches[3];

            return {
                type: KeyPair,
                key: keyWithoutDashes,
                value: value
            }
        }

        return {type: OnlyArguement, value: command}
    }
}