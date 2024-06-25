import CommandExecutionException from "../../console/exceptions/CommandExecutionException";
import BaseMakeCommand from "./BaseMakeCommand";

export interface GenericMakeFileOptions {
    endsWith?: string
}

export default class GenericMakeFileCommand extends BaseMakeCommand
{
    protected args!: string[];
    protected options!: GenericMakeFileOptions;

    /**
     * Allows generic usage of creating a make file command
     * @param signature Example: make:model
     * @param description Example: Create a new model
     * @param key Example: Model
     */
    constructor(signature: string, description: string, key: string, args: string[] = [], options: GenericMakeFileOptions = {} as GenericMakeFileOptions) {
        super()
        this.signature = signature;
        this.description = description;
        this.key = key;
        this.args = args;
        this.options = options;
    }

    /**
     * Base logic for making a new file
     */
    public execute = async () => 
    {
        // Ensure a file always ends with the specified value
        if(this.options.endsWith) {
            this.ensureFileEndsWith(this.options.endsWith);
        }

        // Get the template, inject the arguements
        const template = await this.getTemplateWithInjectedArguments();

        // Assuming every make command has a name argument
        const name = this.getArguementByKey('name')?.value;   

        if(!name) {
            throw new CommandExecutionException('--name argument not specified');
        }

        if(this.existsInTargetDirectory(this.key, name)) {
            throw new CommandExecutionException(`File already exists with name '${name}'`);
        }

        // Write the new file
        this.writeContent(this.key, name, template);

        console.log(`Created ${this.key} as ${name}`);
    }
    
    /**
     * Get template contents with injected argument values
     */
    getTemplateWithInjectedArguments = async (): Promise<string> =>
    {
        // Check all the required arguments are present
        for(const arg of this.args) {
            const value = this.getArguementByKey(arg)?.value;

            if(!value) {
                throw new CommandExecutionException(`--${arg} argument not specified`);
            }
        }

        // Fetch the template
        let contents = (await this.getTemplateContents(this.key))

        // Inject the arguements
        for(const arg of this.args) {
            const value = this.getArguementByKey(arg)?.value as string;
            const pattern = new RegExp('#' + arg + '#', 'g');
            contents = contents.replace(pattern, value);
        }

        return contents
    }

    /**
     * Ensure a file always ends with the specified value
     * @param endsWith 
     */
    ensureFileEndsWith(endsWith: string)
    {
        let name = this.getArguementByKey('name')?.value;

        if(name && !name?.endsWith(endsWith)) {
            name = `${name}${endsWith}`;

            this.setOverwriteArg('name', name)
        }
    }
}