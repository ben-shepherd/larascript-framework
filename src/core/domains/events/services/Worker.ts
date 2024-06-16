import { eventDrivers } from "@src/config/events";
import Repository from "@src/core/base/Repository";
import Singleton from "@src/core/base/Singleton";
import { App } from "@src/core/services/App";
import { ObjectId } from "mongodb";
import { QueueDriverOptions } from "../drivers/QueueDriver";
import FailedWorkerModelFactory from "../factory/failedWorkerModelFactory";
import WorkerModel from "../models/WorkerModel";
import Event from "./Event";
import DriverOptions from "./QueueDriverOptions";

export default class Worker extends Singleton 
{
    public options: QueueDriverOptions;
    
    private driver: string = 'queue';

    private syncDriver: string = 'sync';
    
    constructor() {
        super()
        this.options = this.getOptions()
    }

    protected log(message: string) {
        console.log('[Worker]: ', message)
    }

    /**
     * Work the worker
     */
    async work() {
        // Worker service
        const worker = Worker.getInstance();
        let model: WorkerModel; 

        
        // Fetch the current list of workers
        const workerResults: WorkerModel[] = await worker.getWorkerReslts()
    
        this.log(workerResults.length + ' queued items')
    
        for(const workerModel of workerResults) {
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
     * 
     * @returns 
     */
    getOptions(): QueueDriverOptions {
        return (eventDrivers[this.driver].options as DriverOptions<QueueDriverOptions>).getOptions()
    }

    /**
     * Get the worker results from oldest to newest
     * @returns 
     */
    async getWorkerReslts() {
        const workerRepository = new Repository<WorkerModel>(this.options.collection, WorkerModel)

        return await workerRepository.findMany({}, {
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
        const payload = model.getPayload()

        // Use the sync driver
        const event = new Event(eventName as string, this.syncDriver, payload)

        // Dispatch the event
        await App.container('events').dispatch(event)

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
}