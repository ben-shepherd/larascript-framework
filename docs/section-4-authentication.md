## [Section 4] - Authentication

**Terminology**

*authentication token*: The value of the property stored on the MongoDB collection `apiToken.token`.

*repository* : A repository is class that handles queries to retrieve data models

*jwt* : A signed JSON Web Token that contains the payload `{userId: string: string token, ...}`

### [4.1] Configuration

Navigate to `@src/config/auth/auth.ts`

This config provides all the services, repositories and models the auth service will use when handling with authentication logic.

You can replace these with your own, or extend the modules with your own authentication.

**Example config**

```ts
import ApiToken from '@src/app/models/auth/ApiToken';
import User from '@src/app/models/auth/User';
import ApiTokenRepository from '@src/app/repositories/auth/ApiTokenRepository';
import UserRepository from '@src/app/repositories/auth/UserRepository';
import { AppAuthService } from '@src/app/services/AppAuthService';
import { IAuthConfig } from '@src/core/domains/auth/interfaces/IAuthConfig';
import parseBooleanFromString from '@src/core/util/parseBooleanFromString';

/**
 * Provides type hinting across the application
 * Don't forget to update these properties to match what is provided to the config.
 */
export interface AuthConfigTypeHelpers {
    authService: AppAuthService,
    userModel: User,
    userRepository: UserRepository,
    apiTokenModel: ApiToken
    apiTokenRepository: ApiTokenRepository,
}

const config: IAuthConfig = {
    /**
     * Auth class that can be extended on or replaced
     */
    authService: AppAuthService,
    /**
     * User model
     */
    userModel: User,
    /**
     * User repository for accessing user data
     */
    userRepository: UserRepository,
    /**
     * Api Token model
     */
    apiTokenModel: ApiToken,
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

### [4.2] - Container

The auth service can be retrieved with the `auth` container.

**Example**

```ts
    const auth = App.container('auth');

    const user = await auth.userRepository.findOne({})

    if(!user) {
        throw new Error('No user found');
    }

    const jwt = await auth.createJwtFromUser(user);
```

### [4.3] Auth Service

A look into the available methods and properties for `App.container('auth')`

**Properties**

The default user repository
```ts
userRepository: Repository
```

The default apiToken repository
```ts
apiTokenRepository: Repository
```


**Methods**

Attempt to authorize an *authentication token*

```ts
attemptAuthenticateToken(token: string): Promise<ApiTokenModel | null>
```

Create a *JSON Web Token* from the User

```ts
createJwtFromUser(user: UserModel): Promise<string>
```

Create an ApiTokenModel from the User

```ts
createApiTokenFromUser(user: UserModel): Promise<ApiTokenModel>>
```

Revoke a token

```ts
revokeToken(apiToken: ApiTokenModel): Promise<void>
```

Attempt a login with credentials. Returns an *authentication token*

```ts
attemptCredentials(email: string, password: string): Promise<string>
```

Generate a signed JSON Web Token

    jwt(apiToken: ApiTokenModel): string

**Note**: Your JWT value should be supplied to the `Authorization` header in order to authenticate requests.

    {
        "Authorization": "Bearer eyJhbG..."
    }

### [4.4] ApiToken Model

**ApiToken Methods**

Return the associated User

```ts
user(): Promise<User | null>
```

**Extendable Classes**

**Repository** `@src/app/repositories/auth/ApiTokenRepository.ts`

**Model** `@src/app/models/auth/ApiToken.ts`

**Interface** `@src/app/interfaces/auth/ApiTokenData.ts`



---

### [4.5] User Model

**User Methods**

```ts
const TokenOptionsDefault = {
    activeOnly: false
}

async tokens(options = TokenOptionsDefault): Promise<BaseApiTokenModel[]>
```

**Extendable Classes**

**Repository** `@srcapp/repositories/auth/UserRepository.ts`

**Model** `@src/app/models/auth/User.ts`

**Interface** `@src/app/interfaces/auth/UserData.ts`