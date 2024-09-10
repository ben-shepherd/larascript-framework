import Repository from "@src/core/base/Repository";
import Singleton from "@src/core/base/Singleton";
import { QueueDriverOptions } from "@src/core/domains/events/drivers/QueueDriver";
import EventDriverException from "@src/core/domains/events/exceptions/EventDriverException";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import WorkerModel from "@src/core/domains/events/models/WorkerModel";
import EventSubscriber from "@src/core/domains/events/services/EventSubscriber";
import DriverOptions from "@src/core/domains/events/services/QueueDriverOptions";
import { App } from "@src/core/services/App";
import FailedWorkerModelFactory from "../factory/failedWorkerModelFactory";

export default class Worker extends Singleton {

    /**
     * Queue driver options
     */
    public options!: QueueDriverOptions;

    /**
     * Sync driver for running events
     */
    private syncDriver: string = 'sync';
    
    setDriver(driver: string) {
        this.options = this.getOptions(driver)
        this.log(`Driver set to '${driver}'`,)
    }

    /**
     * Work the worker
     */
    async work() {
        if(!this.options) {
            throw new EventDriverException(`Driver not defined. Did you forget to call 'setDriver'?`)
        }

        // Worker service
        const worker = Worker.getInstance();
        let model: WorkerModel;

        // Fetch the current list of queued results
        const workerResults: WorkerModel[] = await worker.getWorkerResults(this.options.queueName)
    
        this.log('collection: ' + new this.options.workerModelCtor().table)
        this.log(`${workerResults.length} queued items with queue name '${this.options.queueName}'`)
    
        for(const workerModel of workerResults) {
            // We set the model here to pass it to the failedWorkerModel method,
            // but allowing the worker to continue processing
            model = workerModel

            try {
                console.log('Worker processing model', model.getId()?.toString())
                await worker.processWorkerModel(model)
            }
            catch (err) {
                if(!(err instanceof Error)) {
                    console.error(err)
                    return;
                }
    
                await worker.failedWorkerModel(model, err)
            }
        }   
    }
    
    /**
     * Get the driver options based on the driver provided
     * @returns 
     */
    getOptions(driver: string): QueueDriverOptions {
        const eventDriver = App.container('events').getDriver(driver)

        if(!eventDriver) {
            throw new EventDriverException(`Driver '${driver}' not found`)
        }

        return (eventDriver.options as DriverOptions<QueueDriverOptions>).getOptions()
    }

    /**
     * Get the worker results from oldest to newest
     * @returns 
     */
    async getWorkerResults(queueName: string) {
        const workerRepository = new Repository<WorkerModel>(this.options.workerModelCtor)

        return await workerRepository.findMany({
            queueName
        })
    }

    /**
     * Proces the worker by dispatching it through the event driver 'sync'
     * @param model 
     */
    async processWorkerModel(model: WorkerModel) {
        model.table = new this.options.workerModelCtor().table
        const eventName = model.getAttribute('eventName')
        const payload = model.getPayload() as IEventPayload

        // Use the sync driver
        const event = new EventSubscriber(eventName as string, this.syncDriver, payload)

        // Dispatch the event
        await App.container('events').dispatch(event)

        // Delete record as it was a success
        await model.delete();

        this.log(`Processed: ${eventName}`)
    }

    /**
     * Fail the worker
     * @param model 
     * @param err 
     * @returns 
     */
    async failedWorkerModel(model: WorkerModel, err: Error) {
        model.table = new this.options.workerModelCtor().table;

        // Get attempts and max retreis
        const { retries } = this.options
        const currentAttempt = (model.getAttribute('attempt') ?? 0)
        const nextCurrentAttempt = currentAttempt + 1

        this.log(`Failed ${model.getAttribute('eventName')} attempts ${currentAttempt + 1} out of ${retries}, ID: ${model.getId()?.toString()}`)

        // If reached max, move to failed collection
        if(nextCurrentAttempt >= retries) {
            await this.moveFailedWorkerModel(model, err);
            return;
        }

        // Otherwise, update the attempt count
        model.setAttribute('attempt', currentAttempt + 1)
        await model.save()
    }

    /**
     * Moved worker to the failed collection
     * @param model 
     * @param err 
     */
    async moveFailedWorkerModel(model: WorkerModel, err: Error) {
        this.log('Moved to failed')
        
        const failedWorkerModel = (new FailedWorkerModelFactory).create(
            this.options.failedCollection, 
            {
                eventName: model.getAttribute('eventName') as string,
                payload: JSON.stringify(model.getPayload()),
                error: {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                }
            }
        )

        await failedWorkerModel.save()
        await model.delete();
    }

    protected log(message: string) {
        console.log('[Worker]: ', message)
    }

}