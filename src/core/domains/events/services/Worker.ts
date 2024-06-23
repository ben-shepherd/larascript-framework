import { eventDrivers } from "@src/config/events";
import Repository from "@src/core/base/Repository";
import Singleton from "@src/core/base/Singleton";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";
import { QueueDriverOptions } from "../drivers/QueueDriver";
import EventDriverException from "../exceptions/EventDriverException";
import FailedWorkerModelFactory from "../factory/failedWorkerModelFactory";
import { IEventPayload } from "../interfaces/IEventPayload";
import WorkerModel from "../models/WorkerModel";
import EventSubscriber from "./EventSubscriber";
import DriverOptions from "./QueueDriverOptions";

export default class Worker extends Singleton 
{
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
        this.log(`Driver set to '${driver}'`)
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
    
        this.log(`${workerResults.length} queued items with queue name '${this.options.queueName}'`)
    
        for(const workerModel of workerResults) {
            // We set the model here to pass it to the failedWorkerModel method,
            // but allowing the worker to continue processing
            model = workerModel

            try {
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
        if(!eventDrivers[driver]) {
            throw new EventDriverException(`Driver '${driver}' not found`)
        }

        return (eventDrivers[driver].options as DriverOptions<QueueDriverOptions>).getOptions()
    }

    /**
     * Get the worker results from oldest to newest
     * @returns 
     */
    async getWorkerResults(queueName: string) {
        const workerRepository = new Repository<WorkerModel>(this.options.collection, WorkerModel)

        return await workerRepository.findMany({
            queueName
        }, {
            sort: {
                createdAt: 'descending'
            }
        })
    }

    /**
     * Delete the model
     * @param model 
     */
    private async deleteModel(model: WorkerModel) {
        await App.container('mongodb')
            .getDb()
            .collection(this.options.collection)
            .deleteOne({ _id: model.getId() as ObjectId })
    }

    /**
     * Proces the worker by dispatching it through the event driver 'sync'
     * @param model 
     */
    async processWorkerModel(model: WorkerModel) 
    {
        model.collection = this.options.collection
        const eventName = model.getAttribute('eventName')
        const payload = model.getPayload() as IEventPayload

        // Use the sync driver
        const event = new EventSubscriber(eventName as string, this.syncDriver, payload)

        // Dispatch the event
        App.container('events').dispatch(event)

        // Delete record as it was a success
        await this.deleteModel(model)

        this.log(`Processed: ${eventName}`)
    }

    /**
     * Fail the worker
     * @param model 
     * @param err 
     * @returns 
     */
    async failedWorkerModel(model: WorkerModel, err: Error)
    {
        model.collection = this.options.collection;

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
    async moveFailedWorkerModel(model: WorkerModel, err: Error)
    {
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
        await this.deleteModel(model)
    }

    protected log(message: string) {
        console.log('[Worker]: ', message)
    }
}