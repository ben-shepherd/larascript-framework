class ProxyModelHandler implements ProxyHandler<any> {

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
        // Return the constructor's prototype for direct instance checks
        return target.constructor.prototype;
    }

}

export default ProxyModelHandler;