import BaseMakeFileCommand from "../base/BaseMakeFileCommand";

export default class MakeCmdCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:command',
            description: 'Create a new command',
            makeType: 'Command',
            args: ['name'],
            endsWith: 'Command'
        })
    }
}