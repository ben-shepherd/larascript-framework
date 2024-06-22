## [Section 8] - Events

Events provde you the ability to subscribe to certain events and have the listeners perform the work in a seperate location, depending on the driver for that Event.

### [8.1] - Configuration

Navigate to `@src/config/events`

Here is where you can define your event subscribers and listeners, as well as define additional event drivers.

### [8.2] - Subscribers and listeners

A typical subscriber has an `eventName`, a `driver` and a `payload`. 

```ts
import EventSubscriber from "@src/core/domains/events/services/Event";

type Payload = {
    userId: string;
}

export default class ExampleSubscriber extends EventSubscriber<Payload> {
    
    constructor(payload: Payload) {
        const eventName = 'OnExample'
        const driver = 'queue';

        super(eventName, driver, payload)
    }
}
```

Now if we take a look at the config

In the example below, we attach all the listeners to the eventName `OnExample`, which `ExampleSubsciber` has set as it's subscribed name. 

This means that anytime we want to dispatch `ExampleSubsciber`, we expect all the listeners to execute their logic.

```ts
export const eventSubscribers: ISubscribers = {
    'OnExample': [
        ExampleListener
    ]   
}

```

Now anywhere in our code, we can fire the event by using the `events` container to dispatch our subscriber with our desired payload.

```ts
import ExampleSubscriber from './app/events/events/ExampleSubscriber';
import { App } from './core/services/App';

const userId = '123456';

App.container('events').dispatch(new ExampleSubscriber({ userId }));
```



### [8.3] - Event Drivers

Event drivers are like the managers for your subscibers. They can process the event in any number of ways. 

By default there are two event drivers, the 'sync' and the 'queue' driver.

The `sync` driver runs events immediatly, as soon as they are dispatched.

The `queue` driver saves the event and is queued on MongoDB and is executed using worker process (reference to worker: TODO). 


```ts
 /*
 * The default event driver will be used when no driver is defined in the Event
 */
export const defaultEventDriver: string = process.env.APP_EVENT_DRIVER ?? 'sync';
```

```ts
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
            collection: 'workers',
            failedCollection: 'failedWorkers',
            runAfterSeconds: 10
        })
    },
    queueOther: {
        driver: QueueDriver,
        options: new DriverOptions<QueueDriverOptions>({
            queueName: 'other',
            retries: 1,
            collection: 'otherWorkers',
            failedCollection: 'otherFailedWorkers',
            runAfterSeconds: 30
        })
    }
} as const;

```

### [8.4] - Worker

(placeholder)

### [8.5] - Creating your own Event Driver

(placeholder)