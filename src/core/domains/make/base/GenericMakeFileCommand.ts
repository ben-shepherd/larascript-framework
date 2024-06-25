import CommandExecutionException from "../../console/exceptions/CommandExecutionException";
import BaseMakeCommand from "./BaseMakeCommand";

export default class GenericMakeFileCommand extends BaseMakeCommand
{
    protected args!: string[];

    /**
     * Allows generic usage of creating a make file command
     * @param signature Example: make:model
     * @param description Example: Create a new model
     * @param key Example: Model
     */
    constructor(signature: string, description: string, key: string, args: string[] = []) {
        super()
        this.signature = signature;
        this.description = description;
        this.key = key;
        this.args = args;
    }

    /**
     * Base logic for making a new file
     */
    public execute = async () => 
    {
        const template = await this.getTemplateWithInjectedArguments();
        const name = this.getArguementByKey('name')?.value;   

        if(!name) {
            throw new CommandExecutionException('--name argument not specified');
        }

        this.writeContent(this.key, name, template);

        console.log(`Created ${this.key} as ${name}`);
    }
    
    /**
     * Get template contents with injected argument values
     */
    getTemplateWithInjectedArguments = async (): Promise<string> =>
    {
        for(const arg of this.args) {
            const value = this.getArguementByKey(arg)?.value;

            if(!value) {
                throw new CommandExecutionException(`--${arg} argument not specified`);
            }
        }

        let contents = (await this.getContents(this.key))

        for(const arg of this.args) {
            const value = this.getArguementByKey(arg)?.value as string;
            const pattern = new RegExp('#' + arg + '#', 'g');

            contents = contents.replace(pattern, value);
        }

        return contents
    }


}