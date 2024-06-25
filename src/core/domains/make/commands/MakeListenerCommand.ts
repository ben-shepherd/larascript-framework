import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeListenerCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:listener', 'Create a new model', 'Listener', ['name']);
        this.ensureEndsInListener()
    }

    ensureEndsInListener() {
        let name = this.getArguementByKey('name')?.value;

        if(name && !name?.endsWith('Listener')) {
            name = `${name}Listener`;

            this.setOverwriteArg('name', name)
        }
    }
}