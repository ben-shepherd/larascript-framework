import BaseMakeFileCommand from "../base/BaseMakeFileCommand";

export default class MakeSubscriberCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:subscriber',
            description: 'Create a new subscriber',
            makeType: 'Subscriber',
            args: ['name'],
            endsWith: 'Subscriber'
        })
    }
}