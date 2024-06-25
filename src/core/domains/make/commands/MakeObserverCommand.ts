import GenericMakeFileCommand from "../base/GenericMakeFileCommand";

export default class MakeObserverCommand extends GenericMakeFileCommand
{
    constructor() {
        super('make:observer', 'Create an observer', 'Observer', ['name'], {
            endsWith: 'Observer'
        });
    }
}