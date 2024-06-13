## [Section 2] - Services

Your own services can utilise the in built `@src/core/base/Service` or `@src/core/base/Singleton` modules

**Constructor Signature**

Services can be provided optional config.

`constructor: (config: any | null)`

**Recommended Usage**

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
        return 'Cold!'
    }
}
```

**Example**

```ts
import Weather from '@src/app/services/Weather'

(new Weather({ region: 'United Kingdom' })).getTemperature() // Cold!
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
        return 'Cold!'
    }
}
```

Use the `getInstance` method to access your instance

```ts
Weather.getInstance().getTemperature() // Cold!
```