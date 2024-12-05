export type PrefixToTargetPropertyOptions = {
    columnPrefix: string,
    targetProperty: string
}[]

class PrefixToTargetProperty {

    /**
     * Processes an array of objects by moving properties that match a specified
     * prefix to a nested object specified by the property name.
     * 
     * This is useful when you have a result set that is dynamically generated
     * and you want to map the results to a specific object structure.
     * 
     * Example:
     * const result = [
     *   { prefix_id: 1, prefix_name: 'John Doe' },
     *   { prefix_id: 2, prefix_name: 'Jane Doe' },
     * ]
     * const options = [
     *   { prefix: 'prefix_', property: 'targetProperty' }
     * ]
     * 
     * processPrefixToTargetProperty(result, options)
     * 
     * // result is now:
     * [
     *   { targetProperty: { id: 1, name: 'John Doe' } },
     *   { targetProperty: { id: 2, name: 'Jane Doe'} },
     * ]
     * @param {T[]} rows The array of objects to process.
     * @returns {T[]} The processed array of objects.
     */
    static handle<T extends object = object>(arr: T[], options: PrefixToTargetPropertyOptions): T[] {
        return arr.map((current) => {
            const result = { ...current };
            
            for (const option of options) {
                const { columnPrefix, targetProperty } = option;

                for (const currentProperty in current) {
                    if (currentProperty.startsWith(columnPrefix)) {
                        const propertyWithoutPrefix = currentProperty.replace(columnPrefix, '');
                        
                        if (!result[targetProperty]) {
                            result[targetProperty] = {}
                        }
                        
                        result[targetProperty][propertyWithoutPrefix] = current[currentProperty];
                        delete result[currentProperty];
                    }
                }
            }
            
            return result;
        });
    }

}

export default PrefixToTargetProperty