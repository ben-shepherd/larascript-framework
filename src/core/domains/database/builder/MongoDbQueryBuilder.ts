/**
 * Order array type
 */
export type OrderArray = Record<string, 'ASC' | 'DESC'>[]

/**
 * Options for select query
 */
export type SelectOptions = {

    /**
     * Filter for query
     */
    filter?: object;

    /**
     * Allow partial search
     */
    allowPartialSearch?: boolean

    /**
     * Use fuzzy search
     */
    useFuzzySearch?: boolean

}

class MongoDbQueryBuilder {

    /**
     * Build select query
     * @param options Select options
     * @returns Query filter object
     */
    select({ filter = {}, allowPartialSearch = false, useFuzzySearch = false }: SelectOptions): object {

        for(const key in filter) {
            const value = filter[key]

            if(typeof value !== 'string') {
                continue;
            }

            if(allowPartialSearch && value.startsWith('%') || value.endsWith('%')) {

                if(useFuzzySearch) {
                    filter[key] = { $text: { $search: value } }
                    continue;
                } 

                const pattern = this.buildSelectRegexPattern(value)
                filter[key] = { $regex: pattern }
            }
        }
        
        return filter
    }

    /**
     * Builds the regex pattern for partial searches
     * @param value 
     * @returns 
     */
    buildSelectRegexPattern = (value: string): string => {
        const valueWithoutPercentSign = this.stripPercentSigns(value)
        let regex = valueWithoutPercentSign

        if(value.startsWith('%')) {
            regex = '.*' + regex;
        }

        if(value.endsWith('%')) {
            regex = regex + '.*'
        }

        return regex
    }

    /**
     * Strips the percent signs from the start and end of a string
     * @param value The string to strip
     * @returns The stripped string
     */
    stripPercentSigns(value: string): string {
        if(value.startsWith('%')) {
            return value.substring(1, value.length - 1)
        }

        if(value.endsWith('%')) {
            return value.substring(0, value.length - 1)
        }

        return value
    }

}

/**
 * Default export
 */
export default MongoDbQueryBuilder
