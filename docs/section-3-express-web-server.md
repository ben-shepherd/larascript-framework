## [Section 3] - Express Web Server

The express app is set up automatically for you in the following providers:

`@src\core\providers\ExpressProvider.ts`

`@src\core\providers\ExpressListenerProvider.ts`

The express app can be accessed by can calling the container express

```ts
import {App} from '@src/core/services/App';
import {Express} from 'express'

const express: Express = App.container('express').getApp()
```

#### [3.1] Defining Routes

Adding routes can be achieved by updating your `@src/app/routes/api.ts` routing file

*Note:* It is recommended to create seperate files in `@src/app/actions` for your endpoint logic to keep
your project organized.

```ts
import {Route} from "@src/core/interfaces/IRoute"
import {Request, Response} from "express"

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

### [3.2] Adding another routing file

- We will create a new routing file in `@src/app/routes/weather.ts` and create endpoints using the example above.

- Once created, your new routing file needs to be registed in a provider.

- Navigate to `@src/app/providers/AppProvider.ts`

- Import your new routes

```ts
import weatherRoutes

'@src/app/routes/weather'
```

You can use the `App.container('express')` module to bind them to Express. *(References `@src/core/services/Express`)*

Add your routing file

```ts
import {App} from '@src/core/services/App';
import BaseProvider from '@src/core/base/Provider';
import {IAuthConfig} from '@src/core/interfaces/IAuthConfig';
import weatherRoutes

'@src/app/routes/weather';

export default class AppRouteProvider extends BaseProvider {

    // ...

    public async boot(): Promise<void> {
        this.log('Booting RouteProvider');

        App.container('express').bindRoutes(weatherRoutes)
    }
}


```

### [3.3] Protected Routes

**Middleware**

`@src/core/http/middleware/authorize`

Routes that require authorization should use the authorize middleware

**Example**

`@src/app/routes/user.ts`

```ts
import {authorize} from "@src/core/http/middleware/authorize";
import {Route} from "@src/core/interfaces/IRoute";
import updateUser from "@src/app/actions/updateUser";

const routes: Route[] = [
    {
        name: '',
        method: 'get',
        path: '/api/auth/update-user',
        action: updateUser,
        middlewares: [authorize()]
    }
]

export default routes;

```