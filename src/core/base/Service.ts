import IService from "@src/core/interfaces/IService";

/**
 * Service base class
 *
 * @abstract
 * @class Service
 * @implements {IService}
 */
export default abstract class Service<Config> implements IService {

    /**
     * Service configuration
     *
     * @protected
     * @type {Config|null}
     */
    protected config!: Config | null;

    /**
     * Creates an instance of Service
     *
     * @constructor
     * @param {Config|null} [config=null] - Service configuration
     */
    constructor(config: Config | null = null) {
        this.config = config
    }

    /**
     * Returns service configuration
     *
     * @returns {Config|null} - Service configuration
     */
    public getConfig(): Config | null {
        return this.config;
    }

}
