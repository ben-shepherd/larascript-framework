## [Section 9] - Observers

Observers are a special class that allows you to listen for changes in your data and modify them.

### [9.1] - Methods

Each method expects a `data` as the first parameter, and is returned after modified.

**Method Signatures**

Creating runs when your Model is saving for the first time.

```ts
creating?: (...args: any[]) => ReturnType;
```

Creating runs when your Model has been saved for the first time.

```ts
created?: (...args: any[]) => ReturnType;
```

Updating runs if your Model exists in the database and is currently saving.

```ts
updating?: (...args: any[]) => ReturnType;
```

Updating runs if your Model exists in the database and has just saved.

```ts
updated?: (...args: any[]) => ReturnType;
```

Updating runs if your Model exsists in the database and is in the process of being deleted.

```ts
deleting?: (...args: any[]) => ReturnType;
```

Updating runs if your Model exsists in the database and just just been deleted.

```ts
deleted?: (...args: any[]) => ReturnType;
```

### [9.2] - Models

By default all models have observer functionality implemented and can be enabled when required.

First, we'll create our MovieObserver. `@src/app/observers/MovieObserver.ts`

You can run the following command to make an Observer file automatically:

    npm run dev:console -- make:model --name=MovieObserver

**Note**

- We've added predefined methods `updating` and `creating`, and also one custom method `onAuthorChanged`.

- We've also passed a type parameter to the extended `Observer<MovieData>` class. This helps with type hinting when interacting with your Observer.


**Example**

```ts
import Observer from "@src/core/observer/Observer";
import { UserData } from "../models/auth/User";
import { MovieData } from "../models/MovieModel";

export default class MovieObserver extends Observer<MovieData>
{  
    creating = (data: MovieData): MovieData => {
        console.log('MovieData is being created for the first time!')
        return data
    }

    updating = (data: MovieData): MovieData => {
        console.log('MovieData is updating!')
        return data
    }

    onAuthorChanged = (data: UserData): UserData => {
        console.log(`The author has changed!`)
        return data
    }
}
```

To enable the Observer on your model, simply execute `observeWith` in your `constructor` with your observer class as the first parameter. 

We've also defined the `observeProperties` to link the attribute `author` to our custom method.

```ts
observeProperties = {
    author: 'onAuthorChanged'
}
```

See the full example below:

```ts
import Model from '@src/core/base/Model';
import { ObjectId } from 'mongodb';
import MovieObserver from '../observers/MovieObserver';

export interface MovieData {
    _id?: ObjectId;
    subscriptionId: string;
    author: string;
    genre: string;
}

export default class Movie extends Model<MovieData> {

    fields: string[] = [
        ...this.fields,
        'subscriptionId',
        'author',
        'genre',
    ]

    observeProperties = {
        author: 'onAuthorChanged'
    }

    constructor(data: MovieData | null) {
        super(data)
        this.observeWith(MovieObserver)
    }

    getAuthor(): string | null {
        return this.data?.author ?? null
    }

}
```



