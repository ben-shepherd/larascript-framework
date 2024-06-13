## [Section 4] - Authentication

**Terminology**

*authentication token*
; The value of the property stored on the MongoDB collection `apiToken.token`.

*repository*
; A repository is class that handles queries to retrieve data models

*jwt*
; A signed JSON Web Token that contains the payload `{userId: string: string token, ...}`

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