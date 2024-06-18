import BaseCommand from "../base/BaseCommand";

export default class HelpCommand extends BaseCommand {

    signature: string = 'help';
    
    execute = () => {
        console.log('HelpCommand', {
            one: this.getArguementByKey('arg2'),
            two: this.getArguementByKey('arg1'),
        } )
    }
}