import BaseCommand from "@src/core/domains/console/base/BaseCommand";

export default class ExampleCommand extends BaseCommand {

    signature: string = 'app:example';

    execute = async () => {
        console.log('Hello world!')
    }
}