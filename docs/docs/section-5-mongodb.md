## [Section 5] - MongoDB


### [5.1] Database configuration

Configuration: `@src/config/database/mongodb.ts`

```ts
import IMongoDbConfig from "@src/core/domains/database/mongodb/interfaces/IMongoDbConfig";

const config: IMongoDbConfig = {
    /**
     * The default connection when accessing database
     */
    connection: (process.env.MONGODB_CONNECTION as string) ?? 'default',
    /**
     * The additional connections to keep-alive.
     * 
     * Value must be your connection name commma seperated.
     * Example: secondary,externalDb
     */
    keepAliveConnections: (process.env.MONGO_CONNECTIONS_KEEP_ALIVE as string) ?? '',
    /**
     * Configure your connections
     */
    connections: {
        default: {
            uri: process.env.MONGODB_URI as string,
            options: {}
        }
    }
};

export default config
```

**Environment variables**

> MONGODB_URI=mongodb://username:SuperSecretPwd@localhost:37017/app?authSource=admin

---

### [5.2] Handling Multiple Connections

On app launch, only the default `connection` is connected. 

Update `keepAliveConnections` with your `connection` name in order to connect to multiple databases.

**Example**

    MONGO_CONNECTIONS_KEEP_ALIVE=connectionTwo,connectionThree


### [5.3] MongoDB service

Available methods for the `MongoDB` singleton 

**Methods**


Get the [MongoClient](https://mongodb.github.io/node-mongodb-native/6.7/classes/MongoClient.html)

    App.container('mongodb').getClient(): MongoClient

Get the [Db](https://mongodb.github.io/node-mongodb-native/6.7/classes/Db.html)

    App.container('mongodb').getDb(): Db

Attempt connecting by connection name

    App.container('mongodb').connect(connectionName: string): void

Query a collection

*Example*

```ts
const results = App('mongodb')
    .getDb()
    .collection('movies')
    .find({author: 'Christopher Nolan'}).
```

Accessing a collection on another database by providing the `connection` name

*Example*

```ts
const results = App('mongodb')
    .getConnection('secondary') // Added this method
    .getDb()
    .collection('movies')
    .find({author: 'Christopher Nolan'}).
```

### [5.4] Change connection on a Model


Example Model `@src/app/models/Movie.ts`

```ts
import Model from '@src/core/base/Model';

interface MovieData = {
    title: string;
    author: string;
    dateReleased: Date;
}

export default class Movie extends Model<MovieData> {

    /**
     * Change the connection to our secondary database
     */
    public connection: string = 'secondary'

    fields: string[] = [
        'title',
        'author',
        'dateReleased'
    ]
}
```

**Modules**

Reference: `@src/core/domains/database/services/mongodb.ts`

Provided by `@src/core/providers/MongoDBProvider.ts`
