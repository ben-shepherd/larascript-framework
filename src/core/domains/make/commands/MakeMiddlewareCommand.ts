import BaseMakeFileCommand from "../base/BaseMakeFileCommand";

export default class MakeMiddlewareCommand extends BaseMakeFileCommand
{
    constructor() {
        super({
            signature: 'make:middleware',
            description: 'Create a new middleware',
            makeType: 'Middleware',
            args: ['name'],
            endsWith: 'Middleware',
            startWithLowercase: true
        })
    }
}