import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeServiceCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:service',
            description: 'Create a new service',
            makeType: 'Service',
            args: ['name'],
            endsWith: 'Service'
        })
    }

}