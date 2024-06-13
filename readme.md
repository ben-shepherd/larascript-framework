First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

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

- [Section 1] - Providers & Containers [View documentation](docs/section-1-providers-and-containers.md)
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
    - [4.1] - Configuration
    - [4.2] - Extending Authentication
    - [4.3] - Auth Service
    - [4.4] - ApiToken Model
    - [4.5] - User Model

- [Section 5] - MongoDB 
    - [5.1] MongoDB Service
    - [5.3] Database configuration
    - [5.3] Connections

- [Section 6] - Repositories
    - [6.1] - Models

- [Section 7] - Events
    - [7.1] - Create an dispatchable event
    - [7.2] - Add event listeners

- [Section 8] - Observers
    - [8.1] placeholder



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


#### [3.1] Defining Routes
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

### [3.2] Adding another routing file

- We will create a new routing file in `@src/app/routes/weather.ts` and create endpoints using the example above.

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

## [Section 4] - Authentication

### [4.1] Configuration

Navigate to `@src/config/auth/auth.ts`

**Properties**

`authService`: Provies type hinting as the default service that is bound to the container `App.container('auth')`

`userRepository`: The default user repository

`apiToken`: The default apiToken repository

`authRoutes`: When Enabled the auth routes are added to Express

`authCreateAllowed`: When Enabled, the route `/api/auth/create` is added to Express

**Example config**

```ts
import ApiTokenRepository from '@src/app/repositories/auth/ApiTokenRepository';
import UserRepository from '@src/app/repositories/auth/UserRepository';
import { AppAuthService } from '@src/app/services/AppAuthService';
import { IAuthConfig } from '@src/core/interfaces/IAuthConfig';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';

const config: IAuthConfig = {
    /**
     * Expandable auth service class
     * Accessible with App.cotnainer('auth)
     */
    container: AppAuthService,
    /**
     * User repository for accessing user data
     */
    userRepository: UserRepository,
    /**
     * Api token repository for accessing api tokens
     */
    apiTokenRepository: ApiTokenRepository,
    /**
     * Enable or disable auth routes
     */
    authRoutes: parseBooleanFromString(process.env.AUTH_ROUTES, 'true'),
    /**
     * Enable or disable create a new user endpoint
     */
    authCreateAllowed: parseBooleanFromString(process.env.AUTH_ROUTES_ALLOW_CREATE, 'true'),
}

export default config;
```

### [4.2] - Extending Authentication

If you wish to expand on Authentication, see the file `@src/app/services/AppAuthService.ts`

You can create an entirely different authentication file, replacing the property `container` in the config.
This will provide type hinting when accessing your service with `App.container('auth')`.

### [4.3] Auth Service

A look into the available methods and properties for `App.container('auth')`

**Terminology**

*authentication token*: The value of the property stored on the MongoDB collection `apiToken.token`. 

*repository*: A repository is class that handles queries to retrieve data models

*jwt*: A signed JSON Web Token that contains the payload `{userId: string: string token, ...}`

**Properties**

`userRepository: Repository` : The default user repository

`apiTokenRepository: Repository` The default apiToken repository


**Methods**

`jwt(apiToken: BaseApiTokenModel): string` : Generate a signed JSON Web Token

`createToken(user: BaseUserModel): Promise<string>` : Create an *authentication token*

`revokeToken(apiToken: BaseApiTokenModel): Promise<void>` : Revoke an *authentication token*

`attemptAuthenticateToken(token: string): Promise<ApiToken | null>` : Attempt to authorize an *authentication token*

`attemptCredentials(email: string, password: string): Promise<string>` : Attempt a login with credentials. Returns an *authentication token*

**Note**: Your JSON Web Token is the token that should be supplied to the `Authorization` header in order to authenticate requests.

### [4.4] ApiToken Model

**Extendable Repository** `@src/app/repositories/auth/ApiTokenRepository.ts`

**Extendable Model** `@src/app/models/auth/ApiToken.ts`

**Extendable Interface** `@src/app/interfaces/auth/ApiTokenData.ts`
```ts
interface ApiTokenData extends BaseApiTokenData {
    _id?: ObjectId
    userId: ObjectId
    token: string
    revokedAt: Date | null;
}
```

**Methods**

`user(): Promise<User | null>`: Returns the associated user

### [4.5] User Model

**Extendable Repository** `@srcapp/repositories/auth/UserRepository.ts`

**Extendable Model** `@src/app/models/auth/User.ts`

**Extendable Interface** `@src/app/interfaces/auth/UserData.ts`
```ts
interface UserData extends BaseUserData {
    _id?: ObjectId
    email: string
    hashedPassword: string
    roles: string[]
}
```

**Methods**

`tokens(): Promise<ApiToken[]>`: Returns an array of ApiToken models

## MongoDB
[placeholder]

## Models
[placeholder]


## Events
[placeholder]

## Observers
[placeholder]

## Configuration
[placeholder]
