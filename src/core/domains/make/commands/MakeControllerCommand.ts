import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeController extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:controller',
            description: 'Create a new controller',
            makeType: 'Controller',
            args: ['name'],
            endsWith: 'Controller',
            startWithLowercase: false
        })

    }

}