import CommandExecutionException from "@src/core/domains/console/exceptions/CommandExecutionException";
import { IMakeOptions } from "@src/core/domains/make/interfaces/IMakeOptions";
import BaseCommand from "../../console/base/BaseCommand";
import MakeFileService from "../services/MakeFileService";

export default class BaseMakeFileCommand extends BaseCommand
{
    protected options!: IMakeOptions;
    protected makeFileService!: MakeFileService;

    /**
     * Allows generic usage of creating a make file command
     * @param options 
     */
    constructor(options: IMakeOptions) {
        super();
        this.signature = options.signature;
        this.description = options.description;
        this.options = options;
        this.makeFileService = new MakeFileService(this.options);
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

        if(this.makeFileService.existsInTargetDirectory(this.options.makeType, name)) {
            throw new CommandExecutionException(`File already exists with name '${name}'`);
        }

        // Write the new file
        this.makeFileService.writeContent(this.options.makeType, name, template);

        console.log(`Created ${this.options.makeType} as ${name}`);
    }
    
    /**
     * Get template contents with injected argument values
     */
    getTemplateWithInjectedArguments = async (): Promise<string> =>
    {
        // Check all the required arguments are present
        for(const arg of this.options.args) {
            const value = this.getArguementByKey(arg)?.value;

            if(!value) {
                throw new CommandExecutionException(`--${arg} argument not specified`);
            }
        }

        // Fetch the template
        let contents = (await this.makeFileService.getTemplateContents(this.options.makeType))

        // Inject the arguements
        for(const arg of this.options.args) {
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