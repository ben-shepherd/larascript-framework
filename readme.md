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
your routes using the example above.

- Your new routing file needs to be registed in a provider.

- Navigate to `@src/app/providers/AppProvider.ts`

- Import your new routes
```ts
import weatherRoutes '@src/app/routes/weather'
```

Add them to your boot method
```ts
public async boot(): Promise<void> {
    this.log('Booting RouteProvider');

    Express.getInstance().bindRoutes(weatherRoutes)
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
