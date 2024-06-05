import IExpressConfig from "../interfaces/IExpressConfig";
import Express from "../services/Express";
import Provider from "../base/Provider";

export default class ExpressProvider extends Provider
{
    protected configPath: string = 'src/config/http/express';
    protected config!: IExpressConfig;

    constructor() {
        super();
        this.init()
    }

    public async register(): Promise<void> 
    {
        this.log('Registering ExpressProvider');

        Express.getInstance(this.config);
    }

    public async boot(): Promise<void>
    {
        this.log('Booting ExpressProvider');

        Express.getInstance().init();
    }
}