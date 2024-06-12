# Documentation

[describe framework placeholder]

## > Core

[placeholder core briefly]


## > Providers
[describe advantages of utilising providers]

## Services
[placeholder]

### Express
[placeholder]

#### Defining Routes
Adding routes can be achieved by updating your `@src/app/routes/api.ts` routing file

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

**Example** > Adding another routing file

- We will create a new routing file in `@src/app/routes/weather.ts` and create 
define endpoints using the example above.

- Once created, your new routing file needs to be registed in a provider.

- Navigate to `@src/app/providers/AppProvider.ts`

- Import your new routes
```ts
import weatherRoutes '@src/app/routes/weather'
```

Add them to your boot method
```ts
import { App } from '@src/core/services/App';
import BaseProvider from '@src/core/base/Provider';
import { IAuthConfig } from '@src/core/interfaces/IAuthConfig';
import weatherRoutes '@src/app/routes/weather'

export default class AppRouteProvider extends BaseProvider {

    // ...

    public async boot(): Promise<void> {
        this.log('Booting RouteProvider');

        App.container('express').bindRoutes(weatherRoutes)
    }
}


```



### MongoDB
[placeholder]

### Models
[placeholder]

### Authentication
[placeholder]

### Events
[placeholder]

### Observers
[placeholder]

### Configuration
[placeholder]
