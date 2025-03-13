![Larascript Framework Banner](https://www.larascriptnode.com/images/framework-banner-v2.jpg)

## 🚀 BETA STATUS 🚀

Larascript Framework has now entered Beta:

- Features are more stable but may still be subject to change.
- Most functionalities should work as intended, but some issues may persist.
- We welcome your feedback and contributions as we prepare for a stable release.

## Full Documentation

For comprehensive guides and detailed explanations of Larascript Framework's features, please visit our official documentation at [https://www.larascriptnode.com](https://www.larascriptnode.com/).

## Create a new Larascript project

To create a new Larascript project, visit [this link](https://github.com/new?template_name=larascript-framework&template_owner=ben-shepherd) to create a new repository from the Larascript template.


## Project Requirements

Before you begin the installation process, please ensure you have the following software installed on your system:

- **Node.js:** JavaScript runtime for executing code outside a web browser.  
  [Download Node.js](https://nodejs.org/)

- **Yarn Package Manager:** Fast, reliable, and secure dependency management.  
  [Install Yarn](https://yarnpkg.com/getting-started/install)

- **Docker:** Platform for developing, shipping, and running applications in containers.  
  [Get Docker](https://www.docker.com/get-started)

- **Docker Compose:** Tool for defining and running multi-container Docker applications.  
  [Install Docker Compose](https://docs.docker.com/compose/install/)

Having these tools installed will ensure a smooth setup process for your project.

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

3. **Add write permissions to logs directory**

    After installing dependencies, you need to add write permissions to the logs directory:

    ```
    chmod -R 755 /path/to/larascript/storage/logs
    ```

    This ensures that your application can write log files as needed.

4. **Start Database Containers**:

   To set up your database environment, run:

   ```
   yarn db:up
   ```

   This command will start the necessary database containers for your project.

5. **Run the setup command (optional)**:

   If you want to populate the .env file with configured settings, use:

   ```
   yarn setup
   ```

   This step is optional but can be helpful for quickly configuring your environment.

6. **Run database migrations**:

   To set up your database schema, run:

   ```
   yarn dev migrate:up
   ```

   This command will apply all pending database migrations.

7. **Start developing**:

   To start your development server, use:

   ```
   yarn dev
   ```

   This will launch your application in development mode.

## Express.js Routing

Larascript Framework provides an elegant routing system inspired by Laravel. The routing system is built on top of Express.js but offers a more structured and intuitive way to define routes.

```typescript
Route.group(router => {

    router.group({
        prefix: '/posts',
        middleware: [
            AuthorizeMiddleware
        ]
    }, router => {

        router.post('/create', [PostsController, 'createPost'], {
            validator: CreatePostValidator
        })

        // ...

    })
    
})
```

## Resourceful Routing

Larascript Framework provides a powerful resource routing system that allows you to quickly create RESTful routes for your models. With a single configuration object, you can set up CRUD operations, security rules, validation, filtering, searching, and pagination. Here's an example of a fully configured resource route:


```typescript
router.resource({
    prefix: '/posts',
    resource: PostModel,
    middlewares: [AuthorizeMiddleware],
    security: [
        router.security()
            .resourceOwner('userId')
            .when(['create', 'update', 'delete'])
    ],
    validation:  {
        create: CreateBlogPostValidator,
        update: UpdateBlogPostValidator
    },
    filters: {
        active: true
    },
    searching: {
        fields: ['title', 'content']
    },
    paginate: {
        pageSize: 3,
        allowPageSizeOverride: true,
    },
    sorting: {
        fieldKey: 'sort',
        directionKey: 'direction',
        defaultField: 'createdAt',
        defaultDirection: 'asc'
    }
})
```

## Middleware

Middleware provides a convenient mechanism for inspecting and filtering HTTP requests entering your application. The framework's middleware system transforms the traditional Express middleware pattern into a more organized, class-based structure.

```typescript
class ValidatorMiddleware extends Middleware {

    public async execute(context: HttpContext): Promise<void> {
        // Get the validator from the route item
        const validatorConstructor = context.getRouteItem()?.validator;
       
        if(!validatorConstructor) {
            this.next();
            return;
        }

        // Create an instance of the validator
        const validator = new validatorConstructor();

        // Validate the request body
        const result = await validator.validate(context.getRequest().body);

        if(result.fails()) {
            context.getResponse().status(422).json({
                errors: result.errors()
            });
            return;
        }

        // Set the validated request body
        context.getRequest().body = result.validated();

        this.next();
    }
}
```

## Models

Models provide a powerful way to define and customize how your application interacts with database collections. Through model properties, you can control everything from primary keys and field definitions to timestamps and attribute casting.

Key model properties include:

- `primaryKey`: Specifies the primary key field (defaults to 'id')
- `attributes`: Defines the model's attributes and their types
- `fields`: Specifies which attributes can be mass-assigned
- `guarded`: Attributes to exclude when converting to objects
- `dates`: Fields that should be treated as dates
- `timestamps`: Enables automatic created/updated timestamps
- `json`: Fields that should be serialized as JSON
- `relationships`: Defines relationships with other models
- `encrypted`: Fields that should be encrypted
- `casts`: Defines type casting for attributes


```typescript
class PostModel extends Model<{ id: string, title: string, ... }> {

    fields: string[] = [
        'id',
        'title',
        'content',
        'userId',
        'privateComments',
        'postedAt',
        'createdAt',    
        'updatedAt',
    ]

    guarded: string[] = ['userId', 'privateComments'];

    json: string[] = [];

    dates: string[] = ['postedAt'];

    timestamps: boolean = true;

    relationships: string[] = ['user'];

    encrypt: string[] = ['privateComments'];

    user() {
        return this.belongsTo(User, 'userId');
    }

}         
```

## Query Builder

The Query Builder provides a fluent interface for constructing and executing database queries. It works seamlessly with models and supports most database operations through method chaining.

Basic queries include:

- Retrieving records: `all()`, `get()`, `find()`, `first()`, `firstOrFail()`
- Selecting columns: `select()`, `selectRaw()`
- Filtering: `where()` clauses, `orderBy()`
- Raw queries for complex operations
- Eager loading relationships

Example:


```typescript
const query = queryBuilder(PeopleModel)

await query.insert([
    {
        name: 'John',
        age: 35
    },
    {
        name: 'Jane',
        age: 45
    }
])

const collectionOfResults = await query.clone()
    .where('age', '>', 30)
    .orWhere('name', 'like', 'J%')
    .get();

const john = collectionOfResults.where('name', 'John').first();
const jane = collectionOfResults.where('name', 'Jane').first();

john.age = 36;
await john.save();
await jane.delete();
```

## Authentication

The framework provides a robust authentication system that works out of the box with minimal setup required. The authentication system is provided through the AuthProvider which automatically initializes when your application starts.

The default JwtAuthService implements JWT-based authentication and handles token generation, validation, and user authentication. It can be accessed through the `app()` or `authJwt()` helper functions:


```typescript
async handle(context: HttpContext): Promise<ApiResponse> {

    const apiResponse = new ApiResponse();
    const { email, password } = context.getBody();
    
    const user = await authJwt().getUserRepository().findByEmail(email);

    let jwtToken!: string;

    try {
        jwtToken = await authJwt().attemptCredentials(email, password);
    }

    catch (error) {
        if(error instanceof UnauthorizedError) {
            return this.unauthorized('Email or password is incorrect');
        }
        throw error;
    }

    // ...

    return apiResponse
        .setCode(200)
        .setData({
            token: jwtToken,
            user: userAttributes
        });

}
```

## Validation

The validation system provides a flexible and powerful way to validate data in your application. Whether you need to validate user input, API requests, or data before database operations, the validator offers a comprehensive solution with features like:

- Real-time validation for immediate user feedback
- Reusable validation rules across your application 
- Custom error messages for each validation rule
- Middleware support for request validation
- Async validation support

```typescript
const validator = Validator.make({
    email: [
        new RequiredRule(),
        new EmailRule(),
        new UniqueRule(User, 'email')
    ],
    password: [new RequiredRule(), new MinRule(6)],

}, {
    email: 'test@test.com',
    password: 'password',
});
```

## Providers

Service Providers are the central place of all Larascript application bootstrapping. Your own application, as well as all of Larascript's core services, are bootstrapped via service providers.

Service providers are responsible for bootstrapping all of the framework's various components, such as the database, queue, validation, and routing services. Since they bootstrap and configure every feature offered by the framework, service providers are the most important aspect of the entire Larascript bootstrap process.

```typescript
class AuthProvider extends BaseProvider{

    protected config = authConfig

    protected aclConfig = aclConfig

    async register() {
        const authService = new Auth(this.config, this.aclConfig);
        await authService.boot();
        
        // Bind services
        this.bind('auth', authService);
        this.bind('auth.jwt', (() => authService.getDefaultAdapter())())

        // Register commands
        app('console').register().register(GenerateJwtSecret)
    }

}
```

## Inspiration, Philosophy, and Goals

Larascript Framework is influenced by the beloved Laravel Framework by Taylor Otwell, the renowned PHP framework celebrated for its elegant syntax and developer-friendly approach. We've adapted many of Laravel's beloved concepts and design patterns to the Node.js ecosystem, including models, events, observers, and service providers. 

Our aim is to bring Laravel's "developer happiness" philosophy to Node.js, offering a structured yet flexible framework that enhances both efficiency and enjoyment in backend development. While the underlying technologies differ, Larascript Framework embodies the spirit of rapid development, clean code, and powerful features that have made Laravel a favorite in the PHP world.

## Author

LinkedIn: [Visit Benjamin's LinkedIn](https://www.linkedin.com/in/benjamin-programmer/)

Contact Email: [ben.shepherd@gmx.com](mailto:ben.shepherd@gmx.com)

## License

[Larascript](https://www.larascriptnode.com/) © 2024 by [Benjamin Shepherd](https://www.linkedin.com/in/benjamin-programmer/) is licensed under [CC BY 4.0]

## GitHub Metrics

![ben-shepherd's Stats](https://github-readme-stats.vercel.app/api?username=ben-shepherd&theme=dracula&show_icons=true&hide_border=false&count_private=true)

![ben-shepherd's Streak](https://github-readme-streak-stats.herokuapp.com/?user=ben-shepherd&theme=dracula&hide_border=false)

![ben-shepherd's Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=ben-shepherd&theme=dracula&show_icons=true&hide_border=false&layout=compact) 