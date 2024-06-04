import Express from "../services/Express";
import BaseProvider from "./BaseProvider";

export default class ExpressListenerProvider extends BaseProvider
{
    public async register(): Promise<void> 
    {
        this.log('Registering ExpressListenerProvider');
    }

    public async boot(): Promise<void>
    {
        this.log('Booting ExpressListenerProvider');

        await Express.getInstance().listen();

        this.log('Express successfully listening on port ' + this.config.port);
    }
}