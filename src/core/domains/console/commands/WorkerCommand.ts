import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import Worker from "@src/core/domains/events/services/Worker";
import { App } from "@src/core/services/App";

export default class WorkerCommand extends BaseCommand {

    signature: string = 'worker';
    
    execute = async () => {
        const driver = this.getDriverName();
        const worker = Worker.getInstance()

        worker.setDriver(driver)
    
        await worker.work()
        
        if(worker.options.runOnce) {
            return;
        }

        setInterval(async () => {
            await worker.work()
            console.log('Running worker again in ' + worker.options.runAfterSeconds.toString() + ' seconds')
        }, worker.options.runAfterSeconds * 1000)
    }

    getDriverName() {
        if(App.env() === 'testing') {
            return 'testing';
        }

        return process.env.APP_WORKER_DRIVER ?? 'queue';
    }
}