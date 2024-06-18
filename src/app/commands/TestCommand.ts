import BaseCommand from "@src/core/domains/console/base/BaseCommand";

export default class TestCommand extends BaseCommand {

    signature: string = 'test:command';

    execute = () => {
        console.log('TestCommand')
    }
}