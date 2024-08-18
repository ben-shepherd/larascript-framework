import GenericMakeFileCommand from "@src/core/domains/make/base/GenericMakeFileCommand";

export default class MakeRoutesCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:routes', 'Create a routing file', 'Routes', ['name'], {
            endsWith: 'Routes',
            startWithLowercase: true
        });
    }
}