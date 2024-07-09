## [Section 9] - Console Commands

Commands allow you to run processes with your system CLI.

### [9.1] - Worker Command

The worker command runs your queued events.

Worker commands can come in handy when a resource heavy tasks needs to be performed, as it can be run on a seperate server environment.

```ts
npm run start -- worker
```

### [9.2] - Maker commands


Creates a new Model file in `@src/app/models/{fileName}`

```
npm run start -- make:model --name=MovieModel
```

Creates a new Repository file in `@src/app/repositories/{fileName}`

```
npm run start -- make:command --name=MovieRepository
```

Creates a new Service file in `@src/app/services/{fileName}`

```
npm run start -- make:command --name=MovieService
```

Creates a new Singleton Service file in `@src/app/services/{fileName}`

```
npm run start -- make:command --name=MovieSingleton
```

Creates a new Provider file in `@src/app/providers/{fileName}`

```
npm run start -- make:command --name=MovieProvider
```

Creates a new Listener file in `@src/app/events/listeners/{fileName}`

```
npm run start -- make:command --name=MovieListener
```

Creates a new Subscriber file in `@src/app/events/subscribers/{fileName}`

```
npm run start -- make:command --name=MovieSubscriber
```

Creates a new Observer file in `@src/app/events/observers/{fileName}`

```
npm run start -- make:command --name=MovieObserver
```


### [9.2] - Add custom commands

Creating commands consists of creating your initial command file and then registering it in a provider.

Create your command by running the following:

```
npm run start -- make:command --name=MovieCommand
```

Navigate to your App provider in `@src/app/providers/AppProvider.ts`

In your `register` method, you can utilise the `console` container to register multiple commands at once.

```ts
import { App } from "@src/core/services/App";
import BaseProvider from "../../core/base/Provider";
import MovieCommand from '@src/commands/MovieCommand';


export default class AppProvider extends BaseProvider
{
    public async register(): Promise<void> {
        this.log('Registering AppProvider');

        /**
         * Register multiple commands at once
         */
        App.container('console').register().registerAll([
            MovieCommand
        ])
    }

    public async boot(): Promise<void> {
        this.log('Booting AppProvider');
    }
}
```

