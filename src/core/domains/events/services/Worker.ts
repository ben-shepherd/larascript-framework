import Repository from "@src/core/base/Repository";
import Singleton from "@src/core/base/Singleton";
import { QueueDriverOptions } from "@src/core/domains/events/drivers/QueueDriver";
import EventDriverException from "@src/core/domains/events/exceptions/EventDriverException";
import FailedWorkerModelFactory from "@src/core/domains/events/factory/failedWorkerModelFactory";
import { IEventPayload } from "@src/core/domains/events/interfaces/IEventPayload";
import WorkerModel from "@src/core/domains/events/models/WorkerModel";
import EventSubscriber from "@src/core/domains/events/services/EventSubscriber";
import DriverOptions from "@src/core/domains/events/services/QueueDriverOptions";
import { App } from "@src/core/services/App";

/**
 * Worker service
 *
 * This service provides methods for working with the worker table.
 */
export default class Worker extends Singleton {

    /**
     * Queue driver options
     */
    public options!: QueueDriverOptions;

    /**
     * Sync driver for running events
     */
    private syncDriver: string = 'sync';

    /**
     * Set the driver for the worker
     * 
     * @param driver Driver to set
     */
    setDriver(driver: string) {
        this.options = this.getOptions(driver)
        this.logToConsole(`Driver set to '${driver}'`,)
    }

    /**
     * Work the worker
     * 
     * This method will fetch all queued items and process them through the
     * event driver set by the setDriver method. If an error occurs, the
     * worker will retry up to the number of times specified in the options.
     * After the number of retries has been exceeded, the worker will move
     * the item to the failed collection.
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
    
        this.logToConsole('collection: ' + new this.options.workerModelCtor().table)
        this.logToConsole(`${workerResults.length} queued items with queue name '${this.options.queueName}'`)
    
        for(const workerModel of workerResults) {
            // We set the model here to pass it to the failedWorkerModel method,
            // but allowing the worker to continue processing
            model = workerModel

            try {
                App.container('logger').console('Worker processing model', model.getId()?.toString())
                await worker.processWorkerModel(model)
            }
            catch (err) {
                if(!(err instanceof Error)) {
                    App.container('logger').error(err)
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

        this.logToConsole(`Processed: ${eventName}`)
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

        this.logToConsole(`Failed ${model.getAttribute('eventName')} attempts ${currentAttempt + 1} out of ${retries}, ID: ${model.getId()?.toString()}`)

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
        this.logToConsole('Moved to failed')
        
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

    /**
     * Logs a message to the console
     * @param message The message to log
     */
    protected logToConsole(message: string) {
        App.container('logger').console('[Worker]: ', message)
    }

}

