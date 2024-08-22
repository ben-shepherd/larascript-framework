import IService from '@src/core/interfaces/IService';

export default abstract class Service<Config = any> implements IService {
    protected config!: Config | null;

    constructor(config: Config | null = null) {
        this.config = config
    }

    public getConfig(): Config | null {
        return this.config;
    }
}