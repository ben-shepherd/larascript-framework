
export type PrefixToTargetPropertyOptions = {
    columnPrefix: string;
    targetProperty: string;
    setTargetPropertyNullWhenObjectAllNullish?: boolean;
}[]

/**
 * A utility class that processes objects by moving properties with specific prefixes
 * into nested objects. This is useful when working with flattened database results
 * that need to be transformed into structured objects.
 * 
 * Example usage:
 * ```typescript
 * const flattenedData = [
 *   { user_id: 1, user_name: 'John', address_street: '123 Main St', address_city: 'Boston' },
 *   { user_id: 2, user_name: 'Jane', address_street: '456 Park Ave', address_city: 'New York' }
 * ];
 * 
 * const options = [
 *   { columnPrefix: 'user_', targetProperty: 'user' },
 *   { columnPrefix: 'address_', targetProperty: 'address' }
 * ];
 * 
 * const result = PrefixToTargetProperty.handleArray(flattenedData, options);
 * 
 * // Result:
 * // [
 * //   { 
 * //     user: { id: 1, name: 'John' },
 * //     address: { street: '123 Main St', city: 'Boston' }
 * //   },
 * //   {
 * //     user: { id: 2, name: 'Jane' },
 * //     address: { street: '456 Park Ave', city: 'New York' }
 * //   }
 * // ]
 * ```
 */
class PrefixedPropertyGrouper {


    /**
     * Processes an array of objects by moving prefixed properties to nested objects.
     * @param {T[]} rows The array of objects to process.
     * @returns {T[]} The processed array of objects.
     */
    static handleArray<T extends object = object>(arr: T[], options: PrefixToTargetPropertyOptions): T[] {
        return arr.map((current) => this.handleItem(current, options));
    }

    /**
     * Processes a single object by moving prefixed properties to nested objects.
     * @param {T} item The object to process.
     * @param {PrefixToTargetPropertyOptions} options Configuration options.
     * @returns {T} The processed object.
     */
    static handleItem<T extends object = object>(item: T, options: PrefixToTargetPropertyOptions): T {
        const result = { ...item };
        
        options.forEach(option => {
            this.processOption(result, item, option);
        });

        return result;
    }

    /**
     * Processes a single option configuration for an object.
     * @private
     */
    private static processOption<T extends object>(
        result: T, 
        item: T, 
        option: PrefixToTargetPropertyOptions[0]
    ): void {
        const { columnPrefix, targetProperty } = option;
        
        const prefixedProperties = this.extractPrefixedProperties(item, columnPrefix);
        
        if (Object.keys(prefixedProperties).length > 0) {
            result[targetProperty] = prefixedProperties;
            this.deletePrefixedProperties(result, Object.keys(prefixedProperties), columnPrefix);
        }

        if (option.setTargetPropertyNullWhenObjectAllNullish && result[targetProperty]) {
            this.handleNullChecking(result, targetProperty);
        }
    }

    /**
     * Extracts properties that match the given prefix and returns them without the prefix.
     * @private
     */
    private static extractPrefixedProperties<T extends object>(
        item: T, 
        columnPrefix: string
    ): Record<string, any> {
        const prefixedProperties = {};
        
        for (const currentProperty in item) {
            if (currentProperty.startsWith(columnPrefix)) {
                const propertyWithoutPrefix = currentProperty.replace(columnPrefix, '');
                prefixedProperties[propertyWithoutPrefix] = item[currentProperty];
            }
        }
        
        return prefixedProperties;
    }

    /**
     * Deletes the original prefixed properties from the result object.
     * @private
     */
    private static deletePrefixedProperties<T extends object>(
        result: T, 
        properties: string[], 
        columnPrefix: string
    ): void {
        properties.forEach(prop => {
            delete result[`${columnPrefix}${prop}`];
        });
    }

    /**
     * Checks if all properties in the target object are null and sets the entire object to null if specified.
     * @private
     */
    private static handleNullChecking<T extends object>(
        result: T, 
        targetProperty: string
    ): void {
        const allNull = Object.values(result[targetProperty]).every(value => value === null);
        if (allNull) {
            result[targetProperty] = null;
        }
    }

}

export default PrefixedPropertyGrouper;