import DotNotationParser from "./DotNotationParser"

type TStateName = 'INDEX' | 'WILDCARD' | 'SKIPPING_WILDCARD' | 'NEXT' | 'EXIT'

type TState = {
    type: TStateName | null,
    dotPath: DotNotationParser,
    acc: unknown,
    attributes: unknown
}

const states: Record<TStateName, TStateName> = {
    INDEX: 'INDEX',
    WILDCARD: 'WILDCARD',
    SKIPPING_WILDCARD: 'SKIPPING_WILDCARD',
    NEXT: 'NEXT',
    EXIT: 'EXIT'
}

type TDataExtractorOptions = {
    paths: Record<string, unknown>
    data: unknown;
}

/**
 * DataExtractor provides functionality to extract values from nested data structures using dot notation paths
 * 
 * This class allows you to extract specific values from complex nested objects and arrays using
 * dot notation paths with support for wildcards (*). It's particularly useful for:
 * - Extracting values from deeply nested objects
 * - Processing arrays of objects to get specific fields
 * - Handling dynamic paths with wildcards
 * 
 * @example
 * const data = {
 *   users: [
 *     { name: 'John', posts: [{ title: 'Post 1' }] },
 *     { name: 'Jane', posts: [{ title: 'Post 2' }] }
 *   ]
 * };
 * 
 * const paths = {
 *   'users.*.name'          : unknown, // Extract all user names
 *   'users.*.posts.*.title' : unknown  // Extract all post titles
 * };
 * 
 * const extracted = DataExtractor.reduce(data, paths);
 * // Result:

 * // {
 * //   'users.*.name': ['John', 'Jane'],
 * //   'users.*.posts.*.title': ['Post 1', 'Post 2']
 * // }
 */
class DataExtractor {

    /**
     * Static factory method to create and initialize a DataExtractor instance
     * 
     * @param data - The source data object to extract values from
     * @param paths - Object containing dot notation paths as keys
     * @returns Extracted values mapped to their corresponding paths
     */
    public static reduce(data: TDataExtractorOptions['data'], paths: TDataExtractorOptions['paths']): unknown {
        return new DataExtractor().init({
            data,
            paths
        })
    }
    
    /**
     * Initializes data extraction by processing multiple dot notation paths against a data object
     * 
     * @param options - Configuration options for data extraction
     * @param options.data - The source data object to extract values from
     * @param options.paths - Object containing dot notation paths as keys
     * @returns An object containing the extracted values mapped to their paths
     */
    public init(options: TDataExtractorOptions): unknown {
        const { paths, data } = options;
        const pathKeys = Object.keys(paths)

        return pathKeys.reduce((acc, path) => {
            return this.reducer(path, acc, data)
        }, {})
    }

    /**
     * Core recursive function that processes each path segment and extracts values
     * 
     * @param path - Current dot notation path being processed
     * @param acc - Accumulator holding processed values
     * @param attributes - Current data being processed
     * @param recursionLevel - Current depth of recursion (for debugging)
     * @returns Processed value(s) for the current path
     */
    reducer(path: string, acc: unknown, attributes: unknown, recursionLevel = 1) {
        const state = this.getState(path, acc, attributes)

        // Reducing INDEXES
        // Condition: index is string or number, does not equal *, must existpe
        // If the attributes is not an object or array, return attribute
        // If the attributes is an array of objects, we should iterate through and map 
        if(state.type === states.INDEX) {
            return this.reduceAttributes(state, recursionLevel)
        }

        // Reducing SKIPPING WILDCARDS
        // Condition: index is *
        // Nothing to do, return the current attribtues
        if(state.type === states.SKIPPING_WILDCARD) {
            return this.reducer(state.dotPath.getRest() as string, state.acc, state.attributes, recursionLevel + 1)
        }


        // Reducing WILDCARDS
        // Condition: previous INDEX must be a wildcard
        // Condition: attributes must be an array
        // Possibly an object, with a matching object[index]
        if(state.type === states.WILDCARD) {
            return this.reduceAttributes(state, recursionLevel)
        }

        // RECURSIVE
        // Condition: Contains next index
        // execute forward for dotPath, storing previous index
        if(state.type === states.NEXT) {
            return this.reduceAttributes(state, recursionLevel + 1)
        }

        // EXITING
        // Condition: No next index
        // Return value
        console.log('[DataExtractor] exit')

        return acc
    }

    /**
     * Processes attribute values based on the current state and path
     * 
     * @param state - Current state object containing path and data information
     * @param recursionLevel - Current depth of recursion
     * @returns Processed attribute values
     */
    reduceAttributes(state: TState, recursionLevel = 1) {

        const target = state.dotPath.getFirst()
        const nextTarget = state.dotPath.getNext()
        const attributes = state.attributes
        const rest = state.dotPath.getRest()
        const nextRecursionLevel = recursionLevel + 1
        
        // If the attributes is an object and the target exists and there is a next target, reduce the attributes
        if(typeof attributes === 'object' && attributes?.[target] && typeof nextTarget !== 'undefined' && nextTarget !== '*') {
            return this.reducer(
                state.dotPath.getRest() as string,
                state.acc,
                attributes[target],
                nextRecursionLevel
            )
        }

        // If the attributes is an object and the target exists and there is no next target, return the target
        if(typeof attributes === 'object' && attributes?.[target] && typeof rest === 'undefined') {
            return attributes[target]
        } 

        // If the attributes is an object and the target exists and there is a next target, reduce the attributes
        if(typeof attributes === 'object' && attributes?.[target] && typeof rest !== 'undefined') {
            return this.reducer(
                    state.dotPath.getRest() as string,
                    state.acc,
                    attributes[target],
                    nextRecursionLevel
            )
        }

        // If the attributes is an array, reduce the array
        if(Array.isArray(attributes)) {
            return this.reduceArray(state, recursionLevel)
        }

        return attributes
    }

    /**
     * Processes array values by applying the extraction logic to each element
     * 
     * @param state - Current state object containing path and data information
     * @param recursionLevel - Current depth of recursion
     * @returns Array of processed values
     */
    reduceArray(state: TState, recursionLevel = 1) {
        let acc: unknown[] | object = []

        const attributes = state.attributes
        const target = state.dotPath.getFirst()

        const attributesIsArray = Array.isArray(attributes)
        const attributesIsObject = typeof attributes === 'object' && !attributesIsArray
        const containsNestedArrays = attributesIsArray && (attributes as unknown[]).every(attr => Array.isArray(attr))

        const containsNestedObjects = attributesIsArray && (attributes as unknown[]).every(attr => typeof attr === 'object')

        if(attributesIsObject && attributes?.[target]) {
            return attributes[target]
        }

        if(!attributesIsArray) {
            return attributes
        }

        if(containsNestedArrays) {
            acc = [] as unknown[]

            (attributes as unknown[]).forEach(array => {

                (array as unknown[]).forEach(attr => {
                    // Update the state
                    state = this.updateState(state, {
                        attributes: attr as unknown[],
                        acc
                    })
                
                    acc = [
                        ...(acc as unknown[]),
                        this.reduceArray(state, recursionLevel + 1)
                    ]
                })
            })
        }

        if(containsNestedObjects) {
            acc = [] as unknown[]

            (attributes as unknown[]).forEach(obj => {

                // Update the state
                state = this.updateState(state, {
                    attributes: obj as object,
                    acc
                })

                acc = [
                    ...(acc as unknown[]),
                    this.reduceAttributes(state, recursionLevel + 1)
                ]
            })
        }

        return acc
    }

    /**
     * Updates the current state with new values
     * 
     * @param state - Current state object
     * @param update - Partial state updates to apply
     * @returns Updated state object
     */
    protected updateState(state: TState, update: Partial<TState>): TState {
        return {
            ...state,
            ...update
        }
    }

    /**
     * Determines the current state based on path and attributes
     * 
     * @param path - Current dot notation path
     * @param acc - Current accumulator
     * @param attributes - Current attributes being processed
     * @returns State object with type and processing information
     */
    protected getState(path: string, acc: unknown, attributes: unknown) {
        const dotPath = DotNotationParser.parse(path)
        const index = dotPath.getFirst()
        const nextIndex = dotPath.getNext()
        const previousIndex = dotPath.getPrevious()

        const indexIsWildcard = index === '*'
        const previousIsWildcard = previousIndex === '*';

        const attributesStringOrNumber = typeof attributes === 'string' || typeof attributes === 'number';
        const attributesArrayOrObject = Array.isArray(attributes) || typeof attributes === 'object'
        const attributesIndexExists = typeof attributes?.[index] !== 'undefined'
        const attributesIndexValid = attributesStringOrNumber && attributesIndexExists

        // State object
        const state: TState = {
            type: states.EXIT,
            dotPath,
            acc,
            attributes
        }
        
        // SKIPPING WILDCARD state
        if(indexIsWildcard) {
            state.type = states.SKIPPING_WILDCARD
            return state
        }

        // INDEX state
        if(attributesIndexValid || attributesArrayOrObject)  {
            state.type = states.INDEX
            return state
        }

        // WILDCARD state
        if(previousIsWildcard && attributesArrayOrObject) {
            state.type = states.WILDCARD
            return state
        }

        // NEXT state
        if(nextIndex) {
            state.type = states.NEXT
            return state
        }
        
        return state
    }

}

export default DataExtractor