
class PostgresJsonNormalizer {

    /**
     * The property name to use for the array values
     */
    protected arrayProperty = 'ArrayValues'

    /**
     * Normalizes the document by parsing the JSON properties
     * 
     * If a value is an array, wrap it in a values property. e.g, { values: [...] }
     * This is to prevent the error "invalid input syntax for type json",  "malformed array literal"
     * 
     * @param document 
     * @param jsonProperties 
     */
    public normalize(document: object, jsonProperties: string[]) {
        jsonProperties.forEach(property => {
            if(document[property]) {
                document[property] = this.normalizeValue(document[property])
            }
        })

        return document
    }

    /**
     * Denormalizes the document by parsing the JSON properties
     * 
     * @param document 
     * @param jsonProperties 
     */
    public denormalize(document: object, jsonProperties: string[]) {
        jsonProperties.forEach(property => {
            if(document[property]) {
                const value = this.denormalizeValue(document[property])

                const onlyContainsValues = Object.keys(value).length === 1 
                    && Object.keys(value)[0] === this.arrayProperty
                    && Array.isArray(value[this.arrayProperty])

                if(onlyContainsValues) {
                    document[property] = value[this.arrayProperty]
                }
                else {
                    document[property] = value
                }
            }
        })

        return document
    }

    /**
     * Normalizes the value of a JSON property
     * 
     * If a value is an array, wrap it in a values property. e.g, { values: [...] }
     * This is to prevent the error "invalid input syntax for type json",  "malformed array literal"
     * 
     * @param value 
     */
    protected normalizeValue(value: unknown) {
        // Check if it's an array  
        if(Array.isArray(value)) {
            return JSON.stringify({ [this.arrayProperty]: value })
        }

        // Check if it's an object
        if(typeof value === 'object' && value !== null) {
            return JSON.stringify(value)
        }

        return value
    }

    protected denormalizeValue(value: unknown) {
        if(typeof value === 'string') {
            return JSON.parse(value)
        }
        return value
    }

}

export default PostgresJsonNormalizer