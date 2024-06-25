## [Section 1] - Providers & Containers

Providers are what's used to launch and configure your services while it is in boot up.

A config file path can be provided which is automatically parsed and bound to the Provider.

### [1.1] - Registering a provider

**Example** Register a new provider

We will create a new provider in `@src/app/providers/WeatherProvider.ts`

You can also run `npm run console -- make:provider --name=WeatherProvider` to automatically create the file.

```ts
import BaseProvider from "@src/core/base/Provider";
import Weather from '@src/app/services/Weather'; // @ref [Section 2] - Services

// Type hint our config shape
interface WeatherConfig {
    region: 'United Kingdom'
}

export default class WeatherProvider extends BaseProvider {
    // Optional property, by default config is an empty object.
    protected config!: WeatherConfig;

    // Optional if no config is required for this provider
    configPath = '@config/weather';

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering WeatherProvider');

        // Setup the container
        App.container('weather', new Weather(config)) // @ref [Section 1.4] Setting up a new container
    }

    public async boot(): Promise<void> {
        this.log('Booting WeatherProvider');
    }
}
```

### [Section 1.2] - *(Optional)* Type hinting config

Notice how we've created a new interface for `WeatherConfig`, this provides type hinting when
accessing `this.config.region; // Outputs 'United Kingdom'`

We will need to add a config file in `@src/config/weather.ts` and import the `WeatherConfig` interface.

Typing hinting your config will provide strict data types which will prevent bugs further down the line.


```ts
import WeatherConfig from '@src/app/providers/WeatherProvider'

const config: WeatherConfig = {
    region: process.env.REGION ?? 'United Kingdom'
};

export default config
```

### [Section 1.3] - What is a container?

A container is simply a globally accessed variable that can be `any`.

The container name is unique, and will throw an error if a non-unique name is provided.

Let's say you have a new service you'd like to have globally accessible; you may set up a container that provide it,
whether it's an object, a single number or an instance of a class.

**Available methods**

```ts
import {App} from '@src/core/services/App'
```
```ts
App.setContainer(container: string, data:any): void

App.container(name:string): any
```

### [Section 1.4] - Setting up a new container

In your provider, you can import `App` to set a container.

This it typically placed in the `register` or `boot` method of your provider.

**Example**

```ts
import {App} from '@src/core/services/App';
import Weather from '@src/app/services/Weather';

App.container('weather', new Weather())
```

*(Optional)* You may provide your application with type hinting by updating the `ContainersTypeHelpers` interface defined in `@src/containers`

**Example**

```ts
import Weather from '@src/app/services/Weather';

export interface ContainersTypeHelpers {
    [key: string]: any;

    // ...other container types

    weather: Weather,
}

```

### [Section 1.5] - Retrieving from the container

Using `App`, you can retrieve the contents of a container.

**Example**

```ts
const weatherInstance = App.container('weather');

weatherInstance.getRegion() // United Kingdom
weatherInstance.getTemperature() // Cold!
```
