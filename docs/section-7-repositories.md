## [Section 7] - Repositories

The repository design pattern is a way to organize your code and keep all your database queries in one centralized place, seperate from the rest of your application logic.

Making use of this pattern makes your code easier to read, predictable and ensures all your queries are consitent, reliable and most importantly reusable. 

Aditionally, repositories query methods return an instance of your model, giving you access to your custom methods, methods to perform CRUD operations and a way to set and retrieve your data using the methods provided.


### Example

You can run the following command to automatically create the Repository for you:

    npm run console -- make:repository --name=MovieRepository

We will create our file here: `@src/app/repositories/MovieRepository.ts`
```ts
import MovieModel from "@src/app/models/Movie";
import Repository from "@src/core/base/Repository";

export default class MovieRepository extends Repository<MovieModel>
{
    constructor() {
        super('movies', MovieModel)
    }

    findByAuthor(author: string) {
        return this.findOne({author})
    }

    findComedies() {
        return this.findMany({genre: 'Comedy'}, {
            sort: {
                createdAt: 'descending'
            }
        })
    }
}
```

#### Constructor

The `super` called in `constructor()` accepts two arguements. 

- The first being the MongoDB collection name.
- The second is a reference of a Model that can be instantiated. 

```ts
constructor(collectionName: string, modelConstructor: ModelConstructor<Model>)
```

#### Type Hinting

The `Repository` base class accepts a type parameter of your Model class. This is for the purpose of making TypeScript aware of the type of Model and provide type hinting when interacting with the repository.

```ts
class Repository<Model extends IModel> implements IRepository<Model>
```