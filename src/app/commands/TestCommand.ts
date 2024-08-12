import BaseCommand from "@src/core/domains/console/base/BaseCommand";

export default class TestCommand extends BaseCommand {

    signature: string = 'app:test';

    execute = async () => {
        console.log('Hello world!')
    }
}