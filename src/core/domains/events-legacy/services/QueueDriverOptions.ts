
/**
 * Class for storing driver options
 * 
 * @template Options - Type of options object
 */
export default class DriverOptions<Options extends Record<string, any> = {}> {

    /**
     * The options object
     */
    protected options: Options;

    /**
     * Constructor
     * 
     * @param options - The options object to store
     */
    constructor(options: Options = {} as Options) {
        this.options = options;
    }
    
    /**
     * Get the options object
     * 
     * @returns The options object
     */
    getOptions(): Options {
        return this.options;
    }

}
