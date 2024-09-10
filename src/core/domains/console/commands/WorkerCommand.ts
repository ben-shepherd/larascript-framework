import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import Worker from "@src/core/domains/events/services/Worker";
import { App } from "@src/core/services/App";

export default class WorkerCommand extends BaseCommand {

    /**
     * The signature of the command
     */
    signature: string = 'worker';

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

        console.log('Running worker...', worker.options)        
    
        await worker.work();
        
        if(worker.options.runOnce) {
            return;
        }

        setInterval(async () => {
            await worker.work()
            console.log('Running worker again in ' + worker.options.runAfterSeconds.toString() + ' seconds')
        }, worker.options.runAfterSeconds * 1000)
    }

    /**
     * Get the driver name based on the environment
     */
    getDriverName() {
        if(App.env() === 'testing') {
            return 'testing';
        }

        return process.env.APP_WORKER_DRIVER ?? 'queue';
    }

}