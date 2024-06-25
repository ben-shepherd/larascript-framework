import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeServiceCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:service', 'Create a service', 'Service', ['name'], {
            endsWith: 'Service'
        });
    }
}