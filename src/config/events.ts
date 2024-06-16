import { ExampleListener } from "@src/app/events/listeners/ExampleListener";
import QueueDriver, { QueueDriverOptions } from "@src/core/domains/events/drivers/QueueDriver";
import SynchronousDriver from "@src/core/domains/events/drivers/SynchronousDriver";
import { IEventConfig, IEventDrivers, IEventWatcher } from "@src/core/domains/events/interfaces/IEventConfig";
import DriverOptions from "@src/core/domains/events/services/QueueDriverOptions";

/**
 * Event Drivers
 * 
 * Example:
 *      const eventDrivers: IEventDrivers = {
 *          [key: string]: {
 *              driver: [class extends IEventDriver],
 *              options?: new DriverOptions({ retries: 3 })
 *          }
 *      }
 */
export const eventDrivers: IEventDrivers = {
    sync: {
        driver: SynchronousDriver
    },
    queue: {
        driver: QueueDriver,
        options: new DriverOptions<QueueDriverOptions>({
            retries: 3,
            collection: 'workers',
            failedCollection: 'failedWorkers',
            runAfterSeconds: 10
        })
    }
    
 } as const;

/**
 * Event watchers
 * 
 *      Key: Name of the event 
 *      value: Array<Listener>
 * 
 *      Example:
 *      const eventWatchers: IEventWatcher = {
 *         'OnExample': [
 *           ExampleListener
 *         ]   
 *      }
 */
export const eventWatchers: IEventWatcher = {
    'OnExample': [
        ExampleListener
    ]   
}

/**
 * Event config
 */
const eventsConfig: IEventConfig<typeof eventDrivers, typeof eventWatchers> = {

    /**
     * Default Driver
     */
    defaultDriver: 'sync',

    /**
     * Event Drivers
     */
    drivers: eventDrivers,

    /**
     * Watch events
     *      [key]: [class extends EventListener]
     */
    eventWatcher: eventWatchers

} as const;

export default eventsConfig;