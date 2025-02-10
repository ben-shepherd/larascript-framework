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


class DataExtractor {

    public static reduce(data: TDataExtractorOptions['data'], paths: TDataExtractorOptions['paths']): unknown {
        return new DataExtractor().init({
            data,
            paths
        })
    }

    public init(options: TDataExtractorOptions): unknown {
        const { paths, data } = options;
        const pathKeys = Object.keys(paths)

        return pathKeys.reduce((acc, path) => {

            return this.reducer(path, acc, data)

            // if(Array.isArray(data)) {
            //     return (data as unknown[]).map(dataItem => {
            //         return this.reducer(path, acc, dataItem)
            //     })
            // }
            // else if(typeof data === 'object') {
            //     return Object.keys(data as object).map((dataKey) => {
            //         return this.reducer(path, acc, (data as object)[dataKey])
            //     })
            // }

            // return acc
        }, {})
    }

    reducer(path: string, acc: unknown, attributes: unknown, recursionLevel = 1) {
        const state = this.getState(path, acc, attributes)

        console.log('[DataExtractor] reducer path', path)
        console.log('[DataExtractor] reducer state', state)

        // PATH steps
        // 'users' -> * -> posts -> title

        // CURRENTE EXAMPLE
        // { users: [ { name: string, age: number}, ...] }

        // Reducing INDEXES
        // Condition: index is string or number, does not equal *, must existpe
        // If the attributes is not an object or array, return attribute
        // If the attributes is an array of objects, we should iterate through and map 
        if(state.type === states.INDEX) {
            return this.reduceAttributes(state.dotPath.getFirst() as string, state.dotPath.getNext(), attributes, recursionLevel)
        }

        // Reducing SKIPPING WILDCARDS
        // Condition: index is *
        // Nothing to do, return the current attribtues
        if(state.type === states.SKIPPING_WILDCARD) {
            return attributes
        }

        // Reducing WILDCARDS
        // Condition: previous INDEX must be a wildcard
        // Condition: attributes must be an array
        // Possibly an object, with a matching object[index]
        if(state.type === states.WILDCARD) {
            return this.reduceAttributes(state.dotPath.getNext() as string, state.dotPath.getNext(), attributes, recursionLevel)
        }


        // RECURSIVE
        // Condition: Contains next index
        // execute forward for dotPath, storing previous index
        if(state.type === states.NEXT) {
            return this.reducer(state.dotPath.getNext() as string, acc, attributes, recursionLevel + 1)
        }

        // EXITING
        // Condition: No next index
        // Return value
        console.log('[DataExtractor] exit')

        return acc
    }

    reduceAttributes(target: string, nextTarget: string | number |undefined, attributes: unknown, recursionLevel = 1) {

        if(typeof attributes === 'object' && attributes?.[target] && typeof nextTarget !== 'undefined') {
            return this.reduceAttributes(nextTarget as string, attributes[target], recursionLevel + 1)
        }

        if(typeof attributes === 'object' && attributes?.[target]) {
            return attributes[target]
        }

        if(Array.isArray(attributes)) {
            return this.reduceArray(target, nextTarget, attributes, recursionLevel)
        }

        return attributes
    }

    reduceArray(target: string, nextTarget: string | number |undefined, attributes: unknown, recursionLevel = 1) {
        let acc: unknown[] | object = []

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
                    acc = [
                        ...(acc as unknown[]),
                        this.reduceArray(target, nextTarget, attr, recursionLevel + 1)
                    ]
                })
            })
        }
        if(containsNestedObjects) {
            acc = [] as unknown[]

            (attributes as unknown[]).forEach(obj => {
                acc = [
                    ...(acc as unknown[]),
                    this.reduceAttributes(target, nextTarget, obj as object, recursionLevel + 1)
                ]
            })

        }

        return this.reduceArray(target, nextTarget, acc, recursionLevel + 1)
    }

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

        // INDEX state
        if(attributesIndexValid || attributesArrayOrObject)  {
            state.type = states.INDEX
            return state
        }


        // SKIPPING WILDCARD state
        if(indexIsWildcard) {
            state.type = states.SKIPPING_WILDCARD
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