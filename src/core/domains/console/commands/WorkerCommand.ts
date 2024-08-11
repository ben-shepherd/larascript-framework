import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import Worker from "../../events/services/Worker";

export default class WorkerCommand extends BaseCommand {

    signature: string = 'worker';
    
    execute = () => {
        (async() => {
            const driver = process.env.APP_WORKER_DRIVER ?? 'queue';
            const worker = Worker.getInstance()

            worker.setDriver(driver)
        
            await worker.work()
            
            setInterval(async () => {
                worker.work()
                console.log('Running worker again in ' + worker.options.runAfterSeconds.toString() + ' seconds')
            }, worker.options.runAfterSeconds * 1000)
        })();
    }
}