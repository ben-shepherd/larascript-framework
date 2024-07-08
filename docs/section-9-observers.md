## [Section 9] - Observers

Observers are a way to monitor changes to data objects and make changes to them when necessary. 

### [9.1] - Models

By default all models have observer functionality implemented and can be enabled when required.

TODO

### [9.2] - Custom Methods

TODO

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



