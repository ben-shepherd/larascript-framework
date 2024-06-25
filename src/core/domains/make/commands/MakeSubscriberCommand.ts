import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeSubscriberCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:subscriber', 'Create a new model', 'Subscriber', ['name']);
        this.ensureEndsInSubscriber()
    }

    ensureEndsInSubscriber() {
        let name = this.getArguementByKey('name')?.value;

        if(name && !name?.endsWith('Subscriber')) {
            name = `${name}Subscriber`;

            this.setOverwriteArg('name', name)
        }
    }
}