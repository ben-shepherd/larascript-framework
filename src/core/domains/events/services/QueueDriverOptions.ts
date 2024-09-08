
export default class DriverOptions<Options extends Record<string, any> = {}> {
    
    protected options: Options 

    constructor(options: Options = {} as Options) {
        this.options = options;
    }
    
    getOptions(): Options {
        return this.options;
    }

}