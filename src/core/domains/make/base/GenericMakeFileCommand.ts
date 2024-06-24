import CommandExecutionException from "../../console/exceptions/CommandExecutionException";
import BaseMakeCommand, { targetDirectories } from "./BaseMakeCommand";

export default class GenericMakeFileCommand extends BaseMakeCommand
{
    /**
     * Allows generic usage of creating a make file command
     * @param signature Example: make:model
     * @param description Example: Create a new model
     * @param key Example: Model
     */
    constructor(signature: string, description: string, key: string) {
        super()
        this.signature = signature;
        this.description = description;
        this.key = key;
    }

    /**
     * Handle the command
     */
    execute = async () =>
    {
        const name = this.getArguementByKey('name')?.value;

        if(!name) {
            throw new CommandExecutionException('--name argument not specified');
        }

        if(this.existsInTargetDirectory(this.key, name)) {
            throw new CommandExecutionException(`The ${this.key} for '${name}' already exists`);
        }

        const collection = this.getArguementByKey('collection')?.value;

        if(!collection) {
            throw new CommandExecutionException('--collection argument not specified');
        }

        let contents = (await this.getContents(this.key))
        contents = contents.replace(/#name#/g, name)
        contents = contents.replace(/#collection#/g, collection);

        this.writeContent(this.key, name, contents);

        console.log(`${this.key} '${name}' created successfully in '${targetDirectories[this.key]}'`)
    }
}