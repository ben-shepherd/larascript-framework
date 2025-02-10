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

type TDotNotationDataExtratorOptions = {
    paths: string[]
    data: unknown;
}

type TDotNotationDataExtratorResult = Record<string, unknown>


class DotNotationDataExtrator {

    /**
     * Static factory method to create and initialize a DataExtractor instance
     * 
     * @param data - The source data object to extract values from
     * @param path - Object containing dot notation paths as keys
     * @returns Extracted values mapped to their corresponding paths
     */
    public static reduceOne(data: TDotNotationDataExtratorOptions['data'], path: string): TDotNotationDataExtratorResult {
        const result = new DotNotationDataExtrator().init({
            data,
            paths: [path]
        })

        return {
            [path]: result[path]
        }
    }

    /**
     * Static factory method to create and initialize a DataExtractor instance
     * 
     * @param data - The source data object to extract values from
     * @param paths - Object containing dot notation paths as keys
     * @returns Extracted values mapped to their corresponding paths
     */
    public static reduceMany(data: TDotNotationDataExtratorOptions['data'], paths: TDotNotationDataExtratorOptions['paths']): TDotNotationDataExtratorResult {
        return new DotNotationDataExtrator().init({
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
    public init(options: TDotNotationDataExtratorOptions): TDotNotationDataExtratorResult {
        const { paths, data } = options;

        return paths.reduce((acc, path) => {
            acc[path] = this.reducer(path, acc, data)
            return acc
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
            return this.reduceArray(
                this.updateState(state, {
                    attributes: attributes as unknown[],
                    acc: []
                }),
                recursionLevel
            )
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
        const acc: unknown[] = [];
        const target = state.dotPath.getFirst();
        const attributes = state.attributes;
        
        const attributesIsArray = Array.isArray(attributes);
        const attributesIsObject = typeof attributes === 'object' && !attributesIsArray;

        // Handle object case
        if(attributesIsObject && attributes?.[target]) {
            return attributes[target];
        }

        // Return early if not array
        if(!attributesIsArray) {
            return attributes;
        }

        // Process each item in the array
        (attributes as unknown[]).forEach(attr => {
            const result = this.reduceAttributes(
                this.updateState(state, {
                    attributes: attr,
                    acc
                }),
                recursionLevel + 1
            );

            // If result is an array, spread it into acc, otherwise push the single value
            if (Array.isArray(result)) {
                acc.push(...result);
            }
            else {
                acc.push(result);
            }
        });

        return acc;
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

export default DotNotationDataExtrator