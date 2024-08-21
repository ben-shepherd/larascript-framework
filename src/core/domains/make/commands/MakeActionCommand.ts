import BaseMakeFileCommand from "../base/BaseMakeFileCommand";

export default class MakeActionCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:action',
            description: 'Create a new action',
            makeType: 'Action',
            args: ['name'],
            endsWith: 'Action',
            startWithLowercase: true
        })
    }
}