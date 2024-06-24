import BaseProvider from "@src/core/base/Provider";
import { App } from "@src/core/services/App";
import MakeModelCommand from "../commands/MakeModelCommand";
import MakeRepositoryCommand from "../commands/MakeRepositoryCommand";

export default class MakeProvider extends BaseProvider
{
    async register(): Promise<void> 
    {
        console.log('Registering MakeProvider')    

        App.container('console').register().registerAll([
            MakeModelCommand,
            MakeRepositoryCommand
        ])
    }

    async boot(): Promise<void> 
    {
        console.log('Booting MakeProvider')    
    }
}