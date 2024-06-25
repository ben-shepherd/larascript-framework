import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import MakeListenerCommand from "../commands/MakeListenerCommand";
import MakeModelCommand from "../commands/MakeModelCommand";
import MakeRepositoryCommand from "../commands/MakeRepositoryCommand";
import MakeSubscriberCommand from "../commands/MakeSubscriberCommand";

export default class MakeProvider extends BaseProvider
{
    async register(): Promise<void> 
    {
        console.log('Registering MakeProvider')    

        App.container('console').register().registerAll([
            MakeModelCommand,
            MakeRepositoryCommand,
            MakeListenerCommand,
            MakeSubscriberCommand
        ])
    }

    async boot(): Promise<void> 
    {
        console.log('Booting MakeProvider')    
    }
}