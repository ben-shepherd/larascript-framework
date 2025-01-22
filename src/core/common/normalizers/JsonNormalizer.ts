import { NormalizerInterface } from "../interfaces/NormalizerInterface";

class JsonNormalizer implements NormalizerInterface {

    /**
     * Normalizes the document by stringifying the JSON properties
     * 
     * @param document 
     * @param jsonProperties 
     */
    public normalize(document: object, jsonProperties: string[]): object {
        jsonProperties.forEach(property => {
            if(document[property]) {
                document[property] = JSON.stringify(document[property])
            }
        })

        return document
    }

    /**
     * Normalizes the value by stringifying the JSON properties
     * 
     * @param value 
     */
    protected normalizeValue(value: unknown): unknown {
        if(typeof value === 'object' && value !== null) {
            return JSON.stringify(value)
        }
        return value
    }

    /**
     * Denormalizes the document by parsing the JSON properties
     * 
     * @param document 
     * @param jsonProperties 
     */
    public denormalize(document: object, jsonProperties: string[]): object {
        jsonProperties.forEach(property => {
            if(document[property]) {
                document[property] = JSON.parse(document[property])
            }
        })
        return document
    }   

}

export default JsonNormalizer