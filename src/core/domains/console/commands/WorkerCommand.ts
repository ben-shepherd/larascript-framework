import Worker from "../../events/services/Worker";
import BaseCommand from "../base/BaseCommand";

export default class WorkerCommand extends BaseCommand {

    signature: string = 'worker';
    
    execute = () => {
        (async() => {
            const driver = process.env.APP_WORKER_DRIVER ?? 'queue';
            const worker = Worker.getInstance()
            console.log('WORKER', worker)
            worker.setDriver(driver)
        
            await worker.work()
            
            setInterval(async () => {
                worker.work()
                console.log('Running worker again in ' + worker.options.runAfterSeconds.toString() + ' seconds')
            }, worker.options.runAfterSeconds * 1000)
        })();
    }
}