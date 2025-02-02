import AdapterException from "@src/core/exceptions/AdapterException";

export type AdapterTypes<Adapter = unknown> = {
    [key: string]: Adapter;
}

/**
 * @abstract
 * @class BaseAdapter
 * @template AdapterType
 */
abstract class BaseAdapter<AdapterType = unknown> {

    /**
     * @type {AdapterTypes<AdapterType>}
     */
    protected adapters: AdapterTypes<AdapterType> = {};

    /**
     * @param {string} name
     * @param {AdapterType} adapter
     */
    public addAdapter(name: string, adapter: AdapterType): void {
        this.adapters[name] = adapter;
    }

    /**
     * @param {keyof AdapterTypes<AdapterType>} name
     * @returns {AdapterType}
     */
    public getAdapter(name: keyof AdapterTypes<AdapterType>): AdapterType {
        if(!this.adapters[name]) {
            throw new AdapterException(`Adapter ${name} not found`);
        }
        
        return this.adapters[name];
    }

    /**
     * @returns {AdapterTypes<AdapterType>}
     */
    public getAdapters(): AdapterTypes<AdapterType> {
        return this.adapters;
    }

}   

export default BaseAdapter;