import Express from "../services/Express";
import Provider from "../base/Provider";

export default class ExpressListenerProvider extends Provider
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