import BaseCommand from "@src/core/domains/Console/base/BaseCommand";

export default class TestCommand extends BaseCommand {

    signature: string = 'app:test';

    execute = () => {
        console.log('Hello world!')
    }
}