/**
 * Options for parsing rule keys
 * @interface DotNotationParserOptions
 */
export type DotNotationParserOptions = {

    /** The current index/key being accessed */
    index?: string | number;

    /** The next index/key in a nested path */
    nextIndex?: string | number;

    /** Flag indicating if all items should be processed (used with wildcard '*') */
    all?: boolean;

    /** The remaining rule key after parsing */
    rest: string;
}

/**
 * Parser for paths that handles both simple keys and nested paths with wildcards.
 * Supports formats like:
 * - Simple key: "users" or "0"
 * - Nested path: "users.name" or "users.0"
 * - Wildcard: "users.*"
 * 
 * Example:
 * Input: "users.0.name"
 * Output: {
 *   index: "users",
 *   nextIndex: 0,
 *   rest: "0.name"
 * }
 */
class DotNotationParser {

    /**
     * Static factory method to create and parse a path
     * @param path - The path to parse
     * @returns A new DotNotationParser instance with parsed options
     */
    public static parse(path: string) {
        return new DotNotationParser().parse(path)
    }

    /**
     * Constructor for DotNotationParser
     * @param options - The options for the parser
     */
    constructor(
        protected options: DotNotationParserOptions = {} as DotNotationParserOptions
    ) {
        this.options = options
    }

    /**
     * Parses a path into its components
     * @param path - The path to parse
     * @returns A new DotNotationParser instance with parsed options
     */
    public parse(path: string): DotNotationParser {
        const current = new DotNotationParser()

        if(path.includes('.')) {
            return this.parseNextIndex(path, current)
        }

        current.appendOptions({
            index: this.parseIndex(path)
        })

        return current
    }

    /**
     * Parses a value into either a number or string index
     * @param value - The value to parse
     * @returns The parsed index as either a number or string
     */
    protected parseIndex(value: string): string | number {
        if(isNaN(Number(value))) {
            return value
        }
        return Number(value)
    }

    /**
     * Parses a nested path with dot notation
     * @param path - The full path containing a dot
     * @param current - The current DotNotationParser instance
     * @returns The updated DotNotationParser instance
     * @throws Error if the path doesn't contain a dot
     */
    protected parseNextIndex(path: string, current: DotNotationParser): DotNotationParser {
        if(!path.includes('.')) {
            throw new Error('path does not have a next index')
        }

        const pathParts = path.split('.')
        const pathPart0 = pathParts[0]
        const pathPart1 = pathParts[1]
        const rest = pathParts.splice(1).join('.')
        
        if(pathPart1 === '*') {
            current.appendOptions({
                index: this.parseIndex(pathPart0),
                all: true
            })
            return current;
        }

        current.appendOptions({
            index: this.parseIndex(pathPart0),
            nextIndex: this.parseIndex(pathPart1),
            rest: rest
        })

        return current
    }

    /**
     * Merges new options with existing options
     * @param options - Partial options to merge
     * @returns this instance for method chaining
     */
    protected appendOptions(options: Partial<DotNotationParserOptions>): this {
        this.options = {
            ...this.options,
            ...options
        }
        return this
    }

    /**
     * Gets the current index from the parser options
     * @returns The current index as a string or number
     * @throws Error if index is not defined
     */
    public getIndex(): string | number {
        if(typeof this.options.index === 'undefined') {
            throw new Error('index is not defined')
        }
        return this.options.index
    }

    /**
     * Gets the next index from the parser options
     * @returns The next index as a string or number
     * @throws Error if nextIndex is not defined
     */
    public getNextIndex(): string | number {
        if(typeof this.options.nextIndex === 'undefined') {
            throw new Error('nextIndex is not defined')
        }
        return this.options.nextIndex
    }

    /**
     * Checks if the current path has a nested index
     * @returns True if both index and nextIndex are defined
     */
    public isNestedIndex() {
        return typeof this.options.index !== 'undefined' && typeof this.options.nextIndex !== 'undefined'
    }

    /**
     * Checks if the current path uses a wildcard
     * @returns True if the all flag is set
     */
    public isAll() {
        return this.options.all
    }

    /**
     * Gets the remaining unparsed portion of the path
     * @returns The remaining path string
     * @throws Error if rest is not defined
     */
    public getRest(): string {
        if(typeof this.options.rest === 'undefined') {
            throw new Error('rest is not defined')
        }
        return this.options.rest
    }

}

export default DotNotationParser