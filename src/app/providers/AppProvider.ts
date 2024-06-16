import BaseProvider from "../../core/base/Provider";

export interface AppConfig {}

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
 * [Providing type hinting]
 *      Add your type(s) to `@src/config/containers`
 *      in order to provide type hinting when retrieving containers
 *      Example: 
 *          interface ContainersTypeHelpers {
 *              example: { hello: 'world' }
 *          }
 */
export default class AppProvider extends BaseProvider
{
    protected config!: AppConfig;
    //configPath = '@config/example/fileName';

    constructor() {
        super()
        this.init()
    }

    public async register(): Promise<void> {
        this.log('Registering AppProvider');
    }

    public async boot(): Promise<void> {
        this.log('Booting AppProvider');
    }
}