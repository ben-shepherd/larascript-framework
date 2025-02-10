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
class DataExtractorOne {

    /**
     * Static factory method to create and initialize a DataExtractor instance
     * @param attributes - Source data object to extract from
     * @param paths - Object containing path rules for extraction
     * @returns Extracted data based on the provided rules
     */
    public static reduce(attributes: TData, paths: TPathsObject): TPathsObject {
        return new DataExtractorOne().init(paths, attributes)
    }

    /**
     * Initializes the extraction process with the given paths and attributes
     * @param paths - Object containing dot notation paths as keys
     * @param attributes - Source data object to extract from
     * @returns Object containing extracted data mapped to the original paths
     */
    init(paths: TPathsObject, attributes: object): TPathsObject {
        return Object.keys(paths).reduce((acc, path) => {
            const dotPath = DotNotationParser.parse(path)

            return {
                ...acc,
                [path]: this.recursiveReducer(dotPath, acc, attributes) as object
            }
        }, {}) as TPathsObject
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
    protected recursiveReducer(dotPath: DotNotationParser, acc: object | unknown[], attributes: object): unknown {

        const firstIndex = dotPath.getFirst()
        const firstIndexValue = attributes[firstIndex]
        const firstIndexNotUndefined = typeof firstIndexValue !== 'undefined'
        const firstIndexValueIterable = Array.isArray(firstIndexValue)
        const firstIndexIsWildcard = dotPath.getFirst() === '*'

        const nextIndex = dotPath.getNext()
        const nextIndexValue = nextIndex ? attributes[firstIndex]?.[nextIndex] :undefined
        const nextIndexValueNotUndefined = typeof nextIndexValue !== 'undefined'
        const nextIndexValueIterable = Array.isArray(nextIndexValue)
        const hasNextIndex = typeof dotPath.getNext() !== 'undefined';

        const rest = dotPath.getRest()

        const attributesisArray = Array.isArray(attributes)
        const attributesisObject = !attributesisArray && typeof attributes === 'object'
        const attributesArrayOrObject = attributesisArray || attributesisObject

        console.log('[recursiveReducer] debug', {
            dotPath: {
                path: dotPath.getFullPath(),
                next: dotPath.getNext(),
                rest: dotPath.getRest()
            },
            first: {
                value: firstIndexValue,
                iterable: firstIndexValueIterable,
                wildcard: firstIndexIsWildcard
            },
            next: {
                value: nextIndexValue,
                iterable: nextIndexValueIterable
            },
            attributes: attributes,
            acc: acc,
        })

        if(attributesisArray && firstIndexIsWildcard) {
            if(hasNextIndex) {
                acc = [] as unknown[]

                (attributes as unknown[]).forEach((attributeItem) => {
                    const reducedAttributeItem = this.recursiveReducer(DotNotationParser.parse(nextIndex as string), attributeItem as object | unknown[], attributeItem as object)

                    acc = [
                        ...(acc as unknown[]),
                        reducedAttributeItem
                    ]
                })
            }

            else {
                acc = (attributes as unknown[]).map((attributesisArrayItem) => {
                    return attributesisArrayItem
                })
            }

            attributes = [...(acc as unknown[])]
            dotPath.forward()

            return this.recursiveReducer(dotPath, acc, attributes)
        }


        if(typeof firstIndexValue !== 'undefined') {
            acc = {
                [firstIndex]: firstIndexValue
            }
            attributes = attributes[firstIndex]
        }

        if(!firstIndexIsWildcard && attributesisArray && hasNextIndex) {
            acc = [
                ...(attributes as unknown[]).map((attributesItem) => {
                    return this.recursiveReducer(DotNotationParser.parse(nextIndex as string), attributesItem as object | unknown[], attributesItem as object)

                })
            ]

            attributes = [...(firstIndexValue as unknown[])]
        }

        if(firstIndexIsWildcard) {
            acc = firstIndexValue
            attributes = firstIndexValue
            dotPath.forward()
            return this.recursiveReducer(dotPath, acc, attributes)
        }


        if(firstIndexIsWildcard && hasNextIndex && (nextIndexValueNotUndefined || nextIndexValueNotUndefined)) {
            if(firstIndexValueIterable) {
                acc = firstIndexValue.map((firstIndexValueItem) => {
                    return firstIndexValueItem?.[nextIndex as string] 
                })
                attributes = [...(acc as unknown[])]
            }
            else {
                acc = {
                    [firstIndex]: firstIndexValue
                }
                attributes = attributes[firstIndex]
            }
        }

        dotPath.forward()

        if(acc[firstIndex]) {
            return acc
        }

        return this.recursiveReducer(dotPath, acc[firstIndex], attributes)
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

        if (Array.isArray(attributes)) {
            return attributes.map(item => {
                return item[index]
            })
        }
        else if (attributes[index]) {
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
        const currentIndex = parsedPath.getFirst()
        const nextIndex = parsedPath.getNext()
        const rest = parsedPath.getRest()

        // Example: attributes = [{ name: "John" }, { name: "Jane" }]
        // isArray = true
        // isObject = true
        const isArray = Array.isArray(attributes)
        const isObject = !isArray && typeof attributes === 'object'
        const arrayOrObject = isArray || isObject
        
        // If the current index is undefined, return the accumulator as is
        if (attributes[currentIndex] === undefined) {
            return acc
        }

        // This section handles nested data reduction for validation rules
        // For example, with data like: { users: [{ name: "John" }, { name: "Jane" }] }
        // And rule key like: "users.0.name"
        //
        // blankObjectOrArray will be either [] or {} depending on the type of the current value
        // This ensures we maintain the correct data structure when reducing
        const blankObjectOrArray = this.getBlankObjectOrArray(attributes[currentIndex])

        // If the current value is an array, we need to build up a new array
        // If it's an object, we need to build up a new object with the current index as key
        // This preserves the structure while only including validated fields
        if (isArray) {
            if (!Array.isArray(acc)) {
                acc = []
            }
            acc = [
                ...(acc as unknown[]),
                blankObjectOrArray,
            ]
        }
        else if (isObject) {
            acc = {
                ...acc,
                [currentIndex]: blankObjectOrArray
            }
        }

        if(typeof rest === 'undefined') {
            return acc
        }

        // Recursively reduce the rest of the path 
        return this.recursiveReducer(DotNotationParser.parse(rest), acc[currentIndex], attributes[currentIndex])

    }

    /**
     * Returns a blank object or array based on the type of the value
     * 
     * @param value - The value to check
     * @returns A blank object or array
     */
    protected getBlankObjectOrArray(value: unknown): object | unknown[] {
        if (Array.isArray(value)) {
            return []
        }

        return {}
    }

}

export default DataExtractorOne