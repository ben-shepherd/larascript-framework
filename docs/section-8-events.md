## [Section 8] - Events

Events provide you the ability to subscribe to certain events and have the listeners perform the work in a seperate location, depending on the driver for that Event.

### [8.1] - Configuration

Navigate to `@src/config/events`

Here is where you can define your event subscribers and listeners, as well as define additional event drivers.

### [8.2] - Subscribers and listeners

A typical subscriber has an `eventName`, a `driver` and a `payload`. 

**Subscriber Example**

You can also run the following to automatically create a Subscriber file for you:

    npm run console -- make:subscriber --name=ExampleSubscriber

We will create our file here: `@src/app/events/subscribers/ExampleSubscriber.ts`

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

**Listener Example**

You can also run the following to automatically create a Subscriber file for you:

    npm run console -- make:listener --name=ExampleSubscriber

We will create our file here: `@src/app/events/listeners/ExampleListener.ts`

```ts
import EventListener from "@src/core/domains/events/services/EventListener";
 
export class ExampleListener extends EventListener<{userId: string}> {
    
    handle = async (payload: { userId: string}) => {
        console.log('[ExampleListener]', payload.userId)
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

A worker is a seperate process that processes your queued events. These workers can process different items based on the queue name. 

Configuring a queue name is as simple as creating a new event driver in `@src/config/events.ts` and changing the `queueName` property.

Then in your environment changing `APP_WORKER_DRIVER` to the desired driver which will only process those queued items when the worker is running.
 
This will allow you to have multiple processes of the worker in seperate environments to split out resources used for processing.

#### Running the worker

    npm run worker