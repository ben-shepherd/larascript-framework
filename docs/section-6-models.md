## [Section 6] - Models

Models are essential components in your application and provide a standard way of structuring and handling your data across your application. 

### Example

You can run the following command to make a model file automatically:

    npm run dev:console -- make:model --name=Movie

We will create our model file here: 
`@src/app/models/MovieModel.ts`
```ts
import Model from '@src/core/base/Model';
import { ObjectId } from 'mongodb';

interface MovieData {
    _id: ObjectId;
    subscriptionId: string;
    author: string;
    genre: string;
}

export default class Movie extends Model<MovieData> {

    fields: string[] = [
        ...this.fields,
        'subscriptionId'
        'author',
        'genre',
    ]

    guarded: string[] = [
        'subscriptionId'
    ]

    getAuthor(): string | null {
        return this.data?.author ?? null
    }
}
```

---

### [6.1] Properties 

**connection**

The database connection defined in `@src/config/database/mongodb.ts`

**primaryKey**

The primaryKey for your record. By default this would be set to `_id`.

**guarded**

Guarded properties that are excluded when returing `getData` with `excludeGuarded` as true. 

**data**

The data object contains the state for the data in your model.

**dates**

The dates property allows you to set which fields in your data are supposed to be a `Date` type.

**timestamps**

The timestamps boolean allows you to toggle on or off the automatic setting of `createdAt` and `updatedAt` fields.

---

### [6.2] Methods

Set an attribute on your model

```ts
setAttribute<K extends keyof Data = keyof Data>(key: K, value: any): void
```

```ts
movie.setAttribute('genre', 'Horror')
```

Get an value from an attribute

```ts
getAttribute<K extends keyof Data = keyof Data>(key: K): Data[K] | null
```
```ts
const genre = movie.getAttribute('genre')
console.log(genre) // Outputs: 'Horror', but could aslo be null if not set
```

Get the entire data state object from your model

```ts
type GetDataOptions = {
    excludeGuarded: boolean
}
```

```ts
getData(options: GetDataOptions): Data | null
```

Example

```ts
const movie = await (new Repository<Movie>('movies', Movie)).findOne({ author: 'Christopher Nolan' })

const movieData = movie.getData({ exlcudeGuarded: true })

console.log(movieData)

// Returned data without guarded attributes
//  {
//     author: 'Christopher Nolan',
//     title: 'Interstellar',
//     genre: 'Sci-Fi',
//  }

```

### [6.3] CRUD Operations

Save the model 

*If there is no `_id` present, the record will be inserted, otherwise the existing record will update.*

```ts
save(): Promise<void>
```

Update the existing record

*No action will happen if there is no `_id` in the document.*


```ts
update(): Promise<void>
```

Delete the record

*No action will happen if there is no `_id` in the document.*

```ts
delete(): Promise<void>
```

### [6.4] Relationships


**BelongsTo**

```ts
async belongsTo<
    LocalData extends BaseModelData, LocalModel extends Model<LocalData>,
    ForeignData extends BaseModelData, ForeignModel extends Model<ForeignData>
> (
    model: LocalModel,
    localKey: keyof LocalData,
    foreignModelCtor: ModelConstructor<ForeignModel>,
    foreignKey: keyof ForeignData,
    filters: object = {}
): Promise<ForeignModel | null> 
``` 

Example

```ts
public async user(): Promise<User | null> {
    return await this.belongsTo<ApiTokenData, ApiToken, UserData, User>(this, 'userId', User, new User().primaryKey);
}   
```


**HasMany**


```ts
async hasMany<
    LocalData extends BaseModelData, LocalModel extends Model<LocalData>,
    ForeignData extends BaseModelData, ForeignModel extends Model<ForeignData>
> (
    model: LocalModel,
    localKey: keyof LocalData,
    foreignModelCtor: ModelConstructor<ForeignModel>,
    foreignKey: keyof ForeignData,
    filters: object = {}
): Promise<ForeignModel[]>
```

Example (with additional filters)

```ts
async tokens({ activeOnly }: TokensOptions = TokenOptionsDefault): Promise<BaseApiTokenModel[]> {
    const filters: {revokedAt?: null} = {}

    if(activeOnly) {
        filters.revokedAt = null
    }

    return this.hasMany<BaseUserData, BaseUserModel, BaseApiTokenData, BaseApiTokenModel>(
        this,
        this.primaryKey,
        BaseApiTokenModel,
        'userId',
        filters
    )
}

```

**HasOne**

```ts
async hasOne<
    LocalData extends BaseModelData, LocalModel extends Model<LocalData>,
    ForeignData extends BaseModelData, ForeignModel extends Model<ForeignData>
> (
    model: LocalModel,
    localKey: keyof LocalData,
    foreignModelCtor: ModelConstructor<ForeignModel>,
    foreignKey: keyof ForeignData,
    filters: object = {}
): Promise<ForeignModel | null> 
```

Example (with additional filters)

```ts
async author(): Promise<BaseApiTokenModel[]> {
    return this.hasOne<MovieData, MovieModel, AuthorData, AuthorModel>(
        this,
        this.primaryKey,
        AuthorModel,
        'movieId'
    )
}

```