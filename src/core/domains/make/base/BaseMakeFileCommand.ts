import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import CommandExecutionException from "@src/core/domains/console/exceptions/CommandExecutionException";
import { IMakeFileArguments } from "@src/core/domains/make/interfaces/IMakeFileArguments";
import { IMakeOptions } from "@src/core/domains/make/interfaces/IMakeOptions";
import ArgumentObserver from "@src/core/domains/make/observers/ArgumentObserver";
import MakeFileService from "@src/core/domains/make/services/MakeFileService";
import Str from "@src/core/util/str/Str";

const DefaultOptions: Partial<IMakeOptions> = {
    startWithLowercase: false
}

export default class BaseMakeFileCommand extends BaseCommand
{
    public keepProcessAlive = false;

    protected options!: IMakeOptions;
    protected makeFileService!: MakeFileService;
    protected argumentObserver!: ArgumentObserver;
    protected makeFileArguments!: IMakeFileArguments;

    /**
     * Allows generic usage of creating a make file command
     * @param options 
     */
    constructor(options: IMakeOptions) {
        super();
        options = {...DefaultOptions, ...options};
        this.signature = options.signature;
        this.description = options.description;
        this.options = options;
        this.argumentObserver = new ArgumentObserver();
    }

    /**
     * Base logic for preparing the arguments
     * 'name' converts to lower/uppercase depending on options
     * 'collection' is optional and automatically set based on the 'name' arguement
     */
    protected prepareArguments(): void
    {
        if(!this.getArguementByKey('name')?.value) {
            throw new CommandExecutionException('--name argument not specified');
        }

        this.makeFileArguments = {
            name: this.getArguementByKey('name')?.value as string,
            collection: this.getArguementByKey('collection')?.value
        }

        // Set a default collection, if required
        this.makeFileArguments = this.argumentObserver.onCustom('setDefaultCollection', this.makeFileArguments, this.options);
        // Set name the name (lower or upper depending on options)
        this.makeFileArguments = this.argumentObserver.onCustom('setName', this.makeFileArguments, this.options);        
        // Ensure the file ends with the specified value
        this.makeFileArguments = this.argumentObserver.onCustom('setEndsWith', this.makeFileArguments, this.options);

        this.setOverwriteArg('name', this.makeFileArguments.name);

        if(this.makeFileArguments.collection) {
            this.setOverwriteArg('collection', this.makeFileArguments.collection);
        }
    }

    /**
     * Prepare the make file service
     */
    protected prepareMakeFileService(): void
    {
        this.makeFileService = new MakeFileService(this.options, this.makeFileArguments);
    }

    /**
     * Base logic for making a new file
     */
    public execute = async () => 
    {
        this.prepareArguments();
        this.prepareMakeFileService();

        // Get the template, inject the arguements
        const template = await this.getTemplateWithInjectedArguments();

        // Assuming every make command has a name argument
        const name = this.getArguementByKey('name')?.value as string;   

        if(this.makeFileService.existsInTargetDirectory()) {
            throw new CommandExecutionException(`File already exists with name '${name}'`);
        }

        // Write the new file
        this.makeFileService.writeContent(template);

        console.log(`Created ${this.options.makeType}: ` + this.makeFileService.getTargetDirFullPath());
    }
    
    /**
     * Get template contents with injected argument values
     */
    getTemplateWithInjectedArguments = async (): Promise<string> =>
    {
        const { argsOptional = [] } = this.options

        // Fetch the template
        let contents = (await this.makeFileService.getTemplateContents())

        // Inject the arguements
        Object.keys(this.makeFileArguments).forEach(argumentKey => {
            let value = this.makeFileArguments[argumentKey];

            if(!value && !argsOptional.includes(argumentKey)) {
                throw new CommandExecutionException(`--${argumentKey} argument not specified`);
            }

            // Convert to safe method for class names and other places as code the name is used
            if(argumentKey === 'name') {
                value = Str.convertToSafeMethod(value)
            }

            // Inject the arguements
            const pattern = new RegExp('#' + argumentKey + '#', 'g');
            contents = contents.replace(pattern, value);
        })

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

    public getMakeFileService(): MakeFileService
    {
        return this.makeFileService
    }
}