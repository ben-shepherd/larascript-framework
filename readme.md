# Documentation

A TypeScript Node.js framework built with Express and MongoDB.

- Express & Routing
- Authentication (JWTs)
- MongoDB
- Models
- Events
- Observers
- Providers
- Containers


## Core Components

- [Section 1] - Providers & Containers
    - [1.1] - Registering a provider
    - [1.2] - Type hinting config structure
    - [1.3] - What is a container? 
    - [1.4] - Setting up a new container
    - [1.5] - Retrieving from the container

- [Section 2] - Services
    - [2.1] - Singletons

- [Section 3] - Express Web Server
    - [3.1] Defining routes
    - [3.2] Adding another routing file

- [Section 4] - Authentication

- [Section 5] - MongoDB 

- [Section 6] - Models
    - [Section 6.1] - Models
    - [Section 6.2] - Observers

## [Section 1] -  Providers & Containers

### [1.1] - Registering a provider
Providers are used to boot up your application by initalizing configurable services 

**Example** Register a new provider

We will create a new provider in `@src/app/providers/WeatherProvider.ts`

```ts
import BaseProvider from "@src/core/base/Provider";
import Weather from '@src/app/services/Weather'; // @ref [Section 2] - Services

interface WeatherConfig {
    region: 'United Kingdom'
}

export default class WeatherProvider extends BaseProvider
{
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
        App.container('weather', new Weather(config)) // @ref [Section 1.3] Setting up a new container
    }

    public async boot(): Promise<void> {
        this.log('Booting WeatherProvider');
    }
}
```



### [Section 1.2] - *(Optional)* Type hinting config
 Notice how we've created a new interface for `WeatherConfig`, this provides type hinting when accessing `this.config.region; // Outputs 'United Kingdom'`

We will need to add a config file in `@src/config/weather.ts` and import the `WeatherConfig` interface

```ts
import WeatherConfig from '@src/app/providers/WeatherProvider'

const config: WeatherConfig = {
    region: 'United Kingdom'
};

export default config
```

### [Section 1.3] - What is a container? 

A container is simply a globally accessed variable that can be `any`.

Let's say you have a new service you'd like to have globally accessible; you may set up a container that provide it, whether it's an object, a single number or an instance of a class.

**Available methods**

```ts
import { App } from '@src/core/services/App';

App.setContainer(container: string, data: any): void

App.container(name: string): any
```

### [Section 1.4] - Setting up a new container

In your provider, you can import `App` to set a container. 

This it typically placed in the `register` or `boot` method of your provider.

**Example**

```ts
import { App } from '@src/core/services/App';
import MyService from 'path/to/MyService'

App.container('myContainer', new MyService())
```

*(Optional)* You may provide your application with type hinting by updating the interface defined in `@src/containers`

**Example**

```ts
import MyService from 'path/to/MyService'

export interface ContainersTypeHelpers {
    [key: string]: any;

    // ... rest of containers

    myContainer: MyService
}

```

### [Section 1.5] - Retrieving from the container

Using `App`, you can retrieve the contents of a container.

**Example**

```ts
    const myServiceInstance = App.container('myService');
    
    myServiceInstance.someMethod()
```


## [Section 2] - Services

Your own services can utilise the in built `@src/core/base/Service` or `@src/core/base/Singleton` modules 

It is recommended to register your services in a provider and use container methods to access it across your project.

**Example** Creating a new Service

We will create a new file in `@src/app/services/Weather.ts`

```ts
import Service from "@src/core/base/Service";

type WeatherConfig = {
    region: string;
}

export class Weather extends Service<WeatherConfig> {

    constructor(config: WeatherConfig) {
        super(config)
    }

    getRegion(): string {
        return this.getConfig().region
    }

    getTemperature(): string {
        return 'Hot!'
    }
}
```

**Example**

```ts
import Weather from '@src/app/services/Weather'

(new Weather()).getTemperature() // Hot!
```

*(Optional type hinting)* The type parameter for Service can be left blank if no type hinting is required. Example  `extends Service<WeatherConfig>` becomes `extends Service`

### [Section 2.1] - Singleton

```ts
import Singleton from "@src/core/base/Singleton";

type WeatherConfig = {
    region: string;
}

export class Weather extends Singleton<WeatherConfig> {

    constructor(config: WeatherConfig) {
        super(config)
    }

    getRegion(): string {
        return this.getConfig().region
    }

    getTemperature(): string {
        return 'Hot!'
    }
}
```

Use the `getInstance` method to access your instance

```ts
Weather.getInstance().getTemperature() // Hot!
```

## [Section 3] - Express Web Server

The express app is set up automatically for you in the following providers:

`@src\core\providers\ExpressProvider.ts`

`@src\core\providers\ExpressListenerProvider.ts`

The express app can be accessed by can calling the container express

```ts
import { App } from '@src/core/services/App';
import { Express } from 'express'

const express: Express = App.container('express').getApp()
```


#### [Section 3.1] Defining Routes
Adding routes can be achieved by updating your `@src/app/routes/api.ts` routing file

*Note:* It is recommended to create seperate files in `@src/app/actions` for your endpoint logic to keep 
your project organized.

```ts
import { Route } from "@src/core/interfaces/IRoute"
import { Request, Response } from "express"

const routes: Route[] = [
    {
        name: 'index',
        method: 'get',
        path: '/',
        action: (req: Request, res: Response) => {
            res.send('hello world')
        }
    }
]

export default routes
```

### [Section 3.1] Adding another routing file

- We will create a new routing file in `@src/app/routes/weather.ts` and create 
define endpoints using the example above.

- Once created, your new routing file needs to be registed in a provider.

- Navigate to `@src/app/providers/AppProvider.ts`

- Import your new routes
```ts
import weatherRoutes '@src/app/routes/weather'
```

You can use the `App.container('express')` module to bind them to Express. *(References `@src/core/services/Express`)* 

Add your routing file

```ts
import { App } from '@src/core/services/App';
import BaseProvider from '@src/core/base/Provider';
import { IAuthConfig } from '@src/core/interfaces/IAuthConfig';
import weatherRoutes '@src/app/routes/weather';

export default class AppRouteProvider extends BaseProvider {

    // ...

    public async boot(): Promise<void> {
        this.log('Booting RouteProvider');

        App.container('express').bindRoutes(weatherRoutes)
    }
}


```



## MongoDB
[placeholder]

## Models
[placeholder]

## Authentication
[placeholder]

## Events
[placeholder]

## Observers
[placeholder]

## Configuration
[placeholder]
