import BaseCommand from "@src/core/domains/console/base/BaseCommand";

export default class WorkerCommand extends BaseCommand {

    /**
     * The signature of the command
     */
    signature: string = 'worker';

    description = 'Run the worker to process queued event items';

    /**
     * Whether to keep the process alive after command execution
     */
    public keepProcessAlive = true;

    /**
     * Execute the command
     */

    async execute() {



        // setInterval(async () => {
        //     await worker.work()
        //     App.container('logger').console('Running worker again in ' + worker.options.runAfterSeconds.toString() + ' seconds')
        // }, worker.options.runAfterSeconds * 1000)
    }


}