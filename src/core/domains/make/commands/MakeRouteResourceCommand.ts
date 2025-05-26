import BaseMakeFileCommand from "@src/core/domains/make/base/BaseMakeFileCommand";

export default class MakeRouteResourceCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:route-resource',
            description: 'Create a new route resource',
            makeType: 'RouteResource',
            args: ['name'],
            endsWith: 'RouteResource',
            startWithLowercase: true
        })
    }

}