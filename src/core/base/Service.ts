import IService from '../interfaces/IService';

export default abstract class BaseService<TConfig extends Record<any,any> | null> implements IService {
    protected config!: TConfig | null;

    constructor(config: TConfig | null = null) {
        this.config = config
    }

    public getConfig(): TConfig | null {
        return this.config;
    }
}