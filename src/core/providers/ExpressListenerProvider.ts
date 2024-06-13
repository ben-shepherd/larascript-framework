import BaseProvider from "../base/Provider";
import Kernel from "../kernel";
import Express from "../services/Express";
import ExpressProvider from "./ExpressProvider";
import RoutesProvider from "./RoutesProvider";

export default class ExpressListenerProvider extends BaseProvider
{
    public async register(): Promise<void> 
    {
        this.log('Registering ExpressListenerProvider');
    }

    public async boot(): Promise<void>
    {
        if(!Kernel.isProviderReady(ExpressProvider.name)) {
            throw new Error('ExpressProvider must be loaded before ExpressListenerProvider');
        }

        if(!Kernel.isProviderReady(RoutesProvider.name)) {
            throw new Error('RoutesProvider must be loaded before ExpressListenerProvider');
        }

        this.log('Booting ExpressListenerProvider');

        await Express.getInstance().listen();

        this.log('Express successfully listening on port ' + Express.getInstance().getConfig()?.port);
    }
}