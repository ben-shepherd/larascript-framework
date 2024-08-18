import GenericMakeFileCommand from "@src/core/domains/make/base/GenericMakeFileCommand";

export default class MakeMiddlewareCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:middleware', 'Create a middleware file', 'Middleware', ['name'], {
            endsWith: 'Middleware',
            startWithLowercase: true
        });
    }
}