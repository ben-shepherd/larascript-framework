import IService from '../interfaces/IService';

export default abstract class Service<ConfigType> implements IService {
    protected config!: ConfigType | null;

    constructor(config: ConfigType | null = null) {
        this.config = config
    }

    public getConfig(): ConfigType | null {
        return this.config;
    }
}