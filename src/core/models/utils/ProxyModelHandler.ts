/**
 * A proxy handler for model objects that intercepts property access and method calls.
 * 
 * This handler provides a way to access model attributes and methods while maintaining
 * proper 'this' context. It implements the ProxyHandler interface to customize the
 * behavior of JavaScript Proxy objects when used with models.
 * 
 * Key features:
 * - Provides access to model attributes through proxy get operations
 * - Maintains proper method binding to preserve 'this' context
 * - Supports prototype chain lookups
 * 
 * @implements {ProxyHandler<any>}
 */
class ProxyModelHandler implements ProxyHandler<any> {

    /**
     * Retrieves a property from the target model. If the property is a numeric
     * string, it attempts to access the corresponding index in the model's items.
     * If the property is a method, it returns a bound function to ensure the correct
     * 'this' context. Otherwise, it simply returns the property value.
     *
     * @param target - The target model object.
     * @param prop - The property name or index to retrieve.
     * @param receiver - The proxy or object that initiated the get request.
     * @returns The value of the property from the target model, or a bound function if the property is a method.
     */
    // eslint-disable-next-line no-unused-vars
    public get(target: any, prop: string | symbol, receiver: any): any {
        const value = target[prop];
        
        // Handle method calls
        if (typeof value === 'function') {
            return value.bind(target);
        }

        return target?.attributes?.[prop] ?? null;
    }

    // Support proper prototype chain
    public getPrototypeOf(target: any): object | null {
        return target.constructor.prototype;
    }

}

export default ProxyModelHandler;