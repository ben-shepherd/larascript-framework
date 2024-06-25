import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeSubscriberCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:subscriber', 'Create a new model', 'Subscriber', ['name'], {
            endsWith: 'Subscriber'
        });
    }
}