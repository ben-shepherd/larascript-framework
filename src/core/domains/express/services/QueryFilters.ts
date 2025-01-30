import Singleton from "@src/core/base/Singleton";
import QueryFiltersException from "@src/core/domains/express/exceptions/QueryFiltersException";
import { logger } from "@src/core/domains/logger/services/LoggerService";
import { Request } from "express";

type Options = {
    allowedFields?: string[]
}

class QueryFilters extends Singleton {

    protected filters: object | undefined = undefined

    /**
     * Parses the request object to extract the filters from the query string
     * 
     * @param {Request} req - The Express Request object
     * @throws {QueryFiltersException} Throws an exception if the filters are not a string or an object
     * @returns {this} - The QueryFilters class itself to enable chaining
     */
    parseRequest(req: Request, options: Options = {}): this {
        try {
            const { allowedFields: fields = [] } = options;
            let decodedFilters: object = {};

            if(typeof req.query?.filters === 'string') {
                decodedFilters = JSON.parse(decodeURIComponent(req.query?.filters)) ?? {};
            }
            else if(typeof req.query.filters === 'object') {
                decodedFilters = req.query?.filters ?? {};
            }
            
            this.filters = this.stripNonAllowedFields(decodedFilters, fields)
        }
         
        catch (err) { 
            logger().exception(err as Error)
        }

        return this;
    }
    
    /**
     * Strips the non-allowed fields from the filters
     * 
     * @param {object} filters - The filters object
     * @param {string[]} allowedFields - The allowed fields
     * @returns {object} - The stripped filters object
     */
    protected stripNonAllowedFields(filters: object, allowedFields: string[]): object {
        return Object.keys(filters).filter(key => allowedFields.includes(key)).reduce((acc, key) => {
            acc[key] = filters[key];
            return acc;
        }, {});
    }

    /**
     * Returns the parsed filters from the request query string.
     * If no filters were found, returns the defaultValue.
     * @param defaultValue - The default value to return if no filters were found.
     * @returns The parsed filters or the defaultValue.
     */
    getFilters(defaultValue: object | undefined = undefined): object | undefined {
        return this.filters ?? defaultValue
    }

}

export default QueryFilters