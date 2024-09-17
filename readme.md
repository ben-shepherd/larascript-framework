![Larascript Node Banner](https://raw.githubusercontent.com/ben-shepherd/larascript-node/master/assets/banner2.png)

## 🚀 BETA STATUS 🚀

Larascript Node has now entered Beta:

- Features are more stable but may still be subject to change.
- Most functionalities should work as intended, but some issues may persist.
- We welcome your feedback and contributions as we prepare for a stable release.

## About Larascript

Larascript Node is a powerful backend framework designed to streamline the creation of RESTful APIs in JavaScript. Leveraging TypeScript for enhanced code quality and developer experience, it integrates popular packages such as Express, MongoDB, and Postgres. The framework's architecture draws inspiration from PHP's Laravel, offering a familiar and efficient structure for developers.

## Your Guide to Mastering Larascript Node

For comprehensive guides and detailed explanations of Larascript Node's features, please visit our official documentation at [https://www.larascriptnode.com](https://www.larascriptnode.com/).

## Framework Foundations

- Service providers
- Wrappers for ease of use Express.js
- Authentication built in
- Multi-database support (MongoDB & Postgres)
- Migrations for database schema management
- Eloquent-inspired models
- Repository pattern
- Event-driven architecture with queues
- Background workers
- Observer pattern
- Extendable Base Classes
- Command-line interface (CLI) with customizable commands
- Code generation templates
- Comprehensive testing suite (Jest)

##  Quick Setup (~5 minutes)

Follow these steps to quickly set up your project:

1. **Create a new repository**:
   
    Use the following link to create a new repository with Larascript as the template:

    https://github.com/new?template_name=larascript-framework&template_owner=ben-shepherd

2. **Install dependencies**:
   
    Once you've cloned your new repository, run the following command in your project directory:

   ```
   yarn install
   ```

   This will install all the necessary dependencies for your project.

3. **Start Database Containers**:

   To set up your database environment, run:

   ```
   yarn db:up
   ```

   This command will start the necessary database containers for your project.

4. **Run the setup command (optional)**:

   If you want to populate the .env file with configured settings, use:

   ```
   yarn setup
   ```

   This step is optional but can be helpful for quickly configuring your environment.

5. **Run database migrations**:

   To set up your database schema, run:

   ```
   yarn dev migrate:up
   ```

   This command will apply all pending database migrations.

6. **Start developing**:

   To start your development server, use:

   ```
   yarn dev
   ```

   This will launch your application in development mode.


## Larascript Node in Action: Real-World Code Examples

Below are some examples of how you can use Larascript Node.


### Service Providers

Here is an example of our ConsoleProvider which boots up the commands system.

```typescript
export default class ConsoleProvider extends BaseProvider {

    /**
     * Register method
     * Called when the provider is being registered
     * Use this method to set up any initial configurations or services
     */
    async register(): Promise<void> {
        this.log('Registering ConsoleProvider');

        /**
         * Add readline for interacting with the terminal
         */
        App.setContainer('readline', readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        }));

        /**
         * Add the console service to the container
         */
        App.setContainer('console', new ConsoleService())

        /**
         * Register commands from @src/config/commands
         */
        App.container('console').register().registerAll(commandsConfig)
    }

    /**
     * Boot method
     * Called after all providers have been registered
     * Use this method to perform any actions that require other services to be available
     */
    async boot(): Promise<void> {}

}
```

### Models

Here is an example of model. The ApiToken is responsible for handling user tokens.

```typescript
interface IApiTokenData extends IModelData {
    userId: string;
    token: string
    revokedAt: Date | null;
}

class ApiToken extends Model<IApiTokenData> implements IApiTokenModel {

    /**
     * Required ApiToken fields
     *
     * @field userId The user this token belongs to
     * @field token The token itself
     * @field revokedAt The date and time the token was revoked (null if not revoked)
     */
    public fields: string[] = [
        'userId',
        'token',
        'revokedAt'
    ]

    /**
     * Disable createdAt and updatedAt timestamps
     */
    public timestamps: boolean = false;

    /**
     * Finds the related user for this ApiToken
     * @returns The user model if found, or null if not
     */
    public async user(): Promise<IUserModel | null> {
        return this.belongsTo(User, {
            localKey: 'userId',
            foreignKey: 'id',
        })
    }   

}
```

## Repositories

Here is an example of the User repository.

```typescript
export default class UserRepository extends Repository<User> implements IUserRepository {

    constructor() {
        super(User)
    }

    /**
     * Finds a User by their email address
     * @param email 
     * @returns 
     */
    public async findOneByEmail(email: string): Promise<User | null> {
        return await this.findOne({ email })
    }

}
```

## Migration

Here is an example of a migration used to create the ApiToken table.

```typescript
export class CreateApiTokenMigration extends BaseMigration {

    group?: string = 'app:setup';

    async up(): Promise<void> {
        await this.schema.createTable(new ApiToken(null).table, {
            userId: DataTypes.STRING,
            token: DataTypes.STRING,
            revokedAt: DataTypes.DATE
        })
    }

    async down(): Promise<void> {
        await this.schema.dropTable(new ApiToken(null).table);
    }
}
```

## Validator

Here is an example of a Validator used to update a user.

```typescript
class UpdateUserValidator extends BaseValidator {

    rules(): ObjectSchema {
        return Joi.object({
            password: Joi.string().min(6),
            firstName: Joi.string(),
            lastName: Joi.string(),
        })
    }

}
```


## Observer

Here is an example of an Observer, which listens for changes on the User model.

```typescript
export default class UserObserver extends Observer<IUserData> {

    /**
     * Called when the User model is being created.
     * Automatically hashes the password if it is provided.
     * @param data The User data being created.
     * @returns The processed User data.
     */
    creating(data: IUserData): IUserData {
        data = this.onPasswordChange(data)
        return data
    }

    /**
     * Automatically hashes the password if it is provided.
     * @param data The User data being created/updated.
     * @returns The processed User data.
     */
    onPasswordChange(data: IUserData): IUserData {
        if(!data.password) {
            return data
        }
        
        data.hashedPassword = hashPassword(data.password);
        delete data.password;

        return data
    }

}
```

## Coding Standards

To maintain consistency and code quality across the project, we adhere to a set of coding standards. For detailed guidelines and best practices, please refer to our [Coding Standards document](standards.md).

## How Laravel Inspired Our Node.js Journey

Larascript Node is heavily influenced by Laravel, the renowned PHP framework celebrated for its elegant syntax and developer-friendly approach. We've adapted many of Laravel's beloved concepts and design patterns to the Node.js ecosystem, including models, events, observers, and service providers. 

Our aim is to bring Laravel's "developer happiness" philosophy to Node.js, offering a structured yet flexible framework that enhances both efficiency and enjoyment in backend development. While the underlying technologies differ, Larascript Node embodies the spirit of rapid development, clean code, and powerful features that have made Laravel a favorite in the PHP world.

## Author

LinkedIn: [Visit Benjamin's LinkedIn](https://www.linkedin.com/in/benjamin-programmer/)

Contact Email: [ben.shepherd@gmx.com](mailto:ben.shepherd@gmx.com)

## License

[Larascript](https://www.larascriptnode.com/) © 2024 by [Benjamin Shepherd](https://www.linkedin.com/in/benjamin-programmer/) is licensed under [CC BY 4.0]

## GitHub Metrics

![ben-shepherd's Stats](https://github-readme-stats.vercel.app/api?username=ben-shepherd&theme=dracula&show_icons=true&hide_border=false&count_private=true)

![ben-shepherd's Streak](https://github-readme-streak-stats.herokuapp.com/?user=ben-shepherd&theme=dracula&hide_border=false)

![ben-shepherd's Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=ben-shepherd&theme=dracula&show_icons=true&hide_border=false&layout=compact) 