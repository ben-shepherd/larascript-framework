import { ExampleListener } from "@src/app/events/listeners/ExampleListener";
import QueueDriver, { QueueDriverOptions } from "@src/core/domains/events/drivers/QueueDriver";
import SynchronousDriver from "@src/core/domains/events/drivers/SynchronousDriver";
import { IEventDrivers, ISubscribers } from "@src/core/domains/events/interfaces/IEventConfig";
import WorkerModel from "@src/core/domains/events/models/WorkerModel";
import DriverOptions from "@src/core/domains/events/services/QueueDriverOptions";

/**
 * The default event driver will be used when no driver is defined in the Event
 */
export const defaultEventDriver: string = process.env.APP_EVENT_DRIVER ?? 'sync';

/**
 * Event Drivers
 * 
 *      Example:
 *          const eventDrivers: IEventDrivers = {
 *              [key: string]: {
 *                  driver: [class extends IEventDriver],
 *                  options?: new DriverOptions({ retries: 3 })
 *              }
 *          }
 */
export const eventDrivers: IEventDrivers = {
    sync: {
        driver: SynchronousDriver
    },
    queue: {
        driver: QueueDriver,
        options: new DriverOptions<QueueDriverOptions>({
            queueName: 'default',
            retries: 3,
            failedCollection: 'failedWorkers',
            runAfterSeconds: 10,
            workerModelCtor: WorkerModel
        })
    },
    queueOther: {
        driver: QueueDriver,
        options: new DriverOptions<QueueDriverOptions>({
            queueName: 'other',
            retries: 3,
            failedCollection: 'failedWorkers',
            runAfterSeconds: 10,
            workerModelCtor: WorkerModel
        })
    }
    
 } as const;

/**
 * Event Subscribers
 * 
 *      Key: Name of the event 
 *      value: Array<Listener>
 * 
 *      Example:
 *        const eventSubscribers: ISubscribers = {
 *             'OnExample': [
 *               ExampleListener
 *          ]   
 *        }
 */
export const eventSubscribers: ISubscribers = {
    'OnExample': [
        ExampleListener
    ]   
}
