import BaseProvider from "../../core/base/Provider";
import { IAuthConfig } from "../../core/interfaces/IAuthConfig";

    /**
     * @example AppProvider
     * 
     * Provide some data to the container
     * 
     * [Set container]
     *      App.setContainer('example', { hello: 'world '})
     * 
     * [Retrieve container]
     *      console.log('Example conatainer contents', App.container('example')) // Outputs: { hello: 'world ' }
     * 
     * [Typehinting]
     *      Add your type to @src/config/containers in order to provide type hinting
     *      when retrieving containers
     */
export default class AppProvider extends BaseProvider
{
    protected config!: IAuthConfig;
    configPath = '@config/example/fileName';

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering ExampleProvider');
    }

    public async boot(): Promise<void> {
        this.log('Booting ExampleProvider');
    }
}