/* eslint-disable no-unused-vars */
export interface IHasConfigConcern
{
    getConfig<T = unknown>(): T;
    
    setConfig(config: unknown): void;
}