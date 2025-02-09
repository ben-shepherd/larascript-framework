import DotNotationParser from "./DotNotationParser"

/**
 * Represents an object containing dot notation paths as keys
 * @template TPathsObject - The type of the paths object
 */
export type TPathsObject = {
    [key: string]: unknown
}

/**
 * Represents a data object that can be extracted from a nested structure
 * @template TData - The type of the data object
 */
export type TData = Record<string | number, unknown>

/**
 * Utility class for extracting data from nested objects using dot notation paths
 * Supports array indexing, nested objects, and wildcard paths
 * 
 * @example
 * ```typescript
 * const data = {
 *   users: [
 *     { name: 'John', age: 20 },
 *     { name: 'Jane', age: 21 }
 *   ]
 * }
 * 
 * const paths = {
 *   'users.0.name': true,
 *   'users.1.age': true
 * }
 * 
 * const result = DataExtractor.reduce(data, paths)
 * // Result: 

 * // {
 * //   'users.0.name': 'John',
 * //   'users.1.age': 21
 * // }
 * ```

 */
class DataExtractor {

    /**
     * Static factory method to create and initialize a DataExtractor instance
     * @param attributes - Source data object to extract from
     * @param paths - Object containing path rules for extraction
     * @returns Extracted data based on the provided rules
     */
    public static reduce(attributes: TData, paths: TPathsObject) {
        return new DataExtractor().init(paths, attributes)
    }
    
    /**
     * Initializes the extraction process with the given paths and attributes
     * @param paths - Object containing dot notation paths as keys
     * @param attributes - Source data object to extract from
     * @returns Object containing extracted data mapped to the original paths
     */
    init(paths: TPathsObject, attributes: object): TData {
        return Object.keys(paths).reduce((acc, path) => {
            return {
                ...acc,
                [path]: this.recursiveReducer(path, acc, path, attributes) as object
            }
        }, {})
    }

    /**
     * Recursively processes a path to extract data from nested objects/arrays/values
     * 
     * This method:
     * 1. Parses the dot notation path (e.g. "users.0.name") using DotNotationParser
     * 2. Checks if the path contains nested indexes (e.g. "users.0" vs just "users")
     * 3. For nested paths like "users.0.name", calls nestedIndex() to handle the nesting
     * 4. For simple paths like "users", calls nonNestedIndex() to extract the value
     * 5. Handles wildcard paths ("users.*") via the all() method
     * 
     * @param key - The dot notation path to process (e.g. "users.0.name") 
     * @param acc - Accumulator object being built up with extracted data
     * @param curr - Current value being processed
     * @param attributes - Original source data object
     * @returns Updated accumulator with extracted data
     */
    protected recursiveReducer(key: string, acc: object | unknown[], curr: unknown, attributes: object): unknown {

        const parsedPath = DotNotationParser.parse(key)
        const containsNestedIndex = parsedPath.isNestedIndex()

        // If the path contains a nested index, reduce the nested indexes
        if(containsNestedIndex) {
            acc = this.reduceNestedIndexes(parsedPath, acc, attributes) as object | unknown[]
        }

        // If the path contains a non-nested index, reduce the index
        if(containsNestedIndex === false) {
            acc = this.reduceIndex(parsedPath, acc, attributes) as object | unknown[]
        }
        
        // If the path contains a wildcard, reduce all values
        acc = this.reduceAll(parsedPath, acc, attributes)

        return acc
    }

    /**
     * Handles non-nested index validation rules by extracting values at a specific index
     * @param parsedRuleKey - The parsed validation rule key
     * @param acc - The accumulator object being built up
     * @param attributes - The original data object being validated
     * @returns The value at the specified index or the original accumulator
     */
    protected reduceIndex(parsedRuleKey, acc: object, attributes: object) {
        const index = parsedRuleKey.getIndex()

        if(attributes[index]) {
            return attributes[index]
        }

        return acc
    }

    /**
     * Handles nested index validation rules by recursively extracting values from nested paths
     * 
     * For example, with data like: { users: [{ name: "John" }] }
     * And rule key like: "users.0.name"
     * This method will:
     * 1. Extract the users array
     * 2. Get item at index 0 
     * 3. Extract the name property
     * 
     * @param parsedRuleKey - The parsed validation rule key containing nested indexes
     * @param acc - The accumulator object being built up
     * @param attributes - The original data object being validated
     * @returns The updated accumulator with validated data from the nested path
     */
    protected reduceNestedIndexes(parsedPath: DotNotationParser, acc: object | unknown[], attributes: object) {

        // Example: for rule key "users.0.name"
        // currentIndex = "users"
        // nextIndex = "0" 
        // rest = "name"
        const currentIndex = parsedPath.getIndex()
        const nextIndex = parsedPath.getNextIndex()
        const rest = parsedPath.getRest()

        // Example: attributes = [{ name: "John" }, { name: "Jane" }]
        // isArray = true
        // isObject = true
        const isArray = Array.isArray(attributes) 
        const isObject = !isArray && typeof attributes === 'object'
        
        // If the current index is undefined, return the accumulator as is
        if(attributes[currentIndex] === undefined) {
            return acc
        }

        // This section handles nested data reduction for validation rules
        // For example, with data like: { users: [{ name: "John" }, { name: "Jane" }] }
        // And rule key like: "users.0.name"

        const blankObjectOrArray = this.getBlankObjectOrArray(attributes[currentIndex])

        // blankObjectOrArray will be either [] or {} depending on the type of the current value
        // This ensures we maintain the correct data structure when reducing
        
        // If the current value is an array, we need to build up a new array
        // If it's an object, we need to build up a new object with the current index as key
        // This preserves the structure while only including validated fields
        if(isArray) {
            if(!Array.isArray(acc)) {
                acc = []
            }
            acc = [
                ...(acc as unknown[]),
                blankObjectOrArray,
            ]
        }
        else if(isObject) { 
            acc = {
                ...acc,
                [currentIndex]: blankObjectOrArray
            }
        }

        // Recursively reduce the rest of the path
        return this.recursiveReducer(rest, acc[currentIndex], attributes[currentIndex][nextIndex], attributes[currentIndex])
    }

    /**
     * Handles wildcard paths ("users.*") by extracting all items at the current index
     * 
     * For example, with data like: { users: [{ name: "John" }, { name: "Jane" }] }
     * And rule key like: "users.*"
     * This method will extract all items at the users index
     * 
     * @param parsedPath - The parsed validation rule key
     * @param acc - The accumulator object being built up
     * @param attributes - The original data object being validated
     * @returns The updated accumulator with validated data from the wildcard path
     */
    protected reduceAll(parsedPath: DotNotationParser, acc: object, attributes: object) {
        if(!parsedPath.isAll()) {
            return acc;

        }

        const index = parsedPath.getIndex()
        
        if(attributes[index]) {
            return {
                ...acc,
                [index]: attributes[index]
            }
        }

        return acc
    }

    /**
     * Returns a blank object or array based on the type of the value
     * 
     * @param value - The value to check
     * @returns A blank object or array
     */
    protected getBlankObjectOrArray(value: unknown): object | unknown[] {
        if(Array.isArray(value)) {
            return []
        }
        
        return {}
    }

}

export default DataExtractor