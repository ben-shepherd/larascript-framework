import MakeHandler from "../make/MakeHandler";

export default class CommandReader {

    handle() {
        const args = process.argv.slice(2)

        if(args[0].startsWith('make:') && args[0].length > 5) {
            const split = args[0].split('make:')

            if(split[1].toLocaleLowerCase() === 'model') {
                (new MakeHandler).makeModel(args[0])
                return;
            }

            this.log('[handleMake] no maker found: ', args[0])
        }
    }

    protected log(message: string, ...opts: any[]) {
        console.log(`[CommandReader] ${message}`, ...opts)
    }
}