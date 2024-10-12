import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import Worker from "@src/core/domains/events/services/Worker";
import { App } from "@src/core/services/App";

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
        const driver = this.getDriverName();
        const worker = Worker.getInstance()
        worker.setDriver(driver)

        App.container('logger').console('Running worker...', worker.options)

        await worker.work();

        if (worker.options.runOnce) {
            return;
        }

        setInterval(async () => {
            await worker.work()
            App.container('logger').console('Running worker again in ' + worker.options.runAfterSeconds.toString() + ' seconds')
        }, worker.options.runAfterSeconds * 1000)
    }

    /**
     * Get the driver name based on the environment
     */
     
    getDriverName() {
        if (App.env() === 'testing') {
            return 'testing';
        }

        return process.env.APP_WORKER_DRIVER ?? 'queue';
    }

}