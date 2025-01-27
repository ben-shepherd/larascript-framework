import Singleton from "@src/core/base/Singleton";
import QueryFiltersException from "@src/core/domains/express/exceptions/QueryFiltersException";
import { SearchOptionsLegacy } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { logger } from "@src/core/domains/logger/services/LoggerService";
import { Request } from "express";

class QueryFilters extends Singleton {

    protected filters: object | undefined = undefined

    /**
     * Parses the request object to extract the filters from the query string
     * 
     * @param {Request} req - The Express Request object
     * @throws {QueryFiltersException} Throws an exception if the filters are not a string or an object
     * @returns {this} - The QueryFilters class itself to enable chaining
     */
    parseRequest(req: Request, options: SearchOptionsLegacy = {} as SearchOptionsLegacy): this {
        try {
            const { fields = [] } = options;
            let decodedFilters: object = {};

            if(typeof req.query?.filters === 'string') {
                decodedFilters = JSON.parse(decodeURIComponent(req.query?.filters)) ?? {};
            }
            else if(typeof req.query.filters === 'object') {
                decodedFilters = req.query?.filters ?? {};
            }
            else {
                throw new QueryFiltersException('Filters must be a string or an object')
            }
            
            let filters: object = {};

            fields.forEach((field: string) => {
                if (field in decodedFilters) {
                    filters = {
                        ...filters,
                        [field]: decodedFilters[field]
                    }
                }
            })
            
            this.filters = filters
        }
         
        catch (err) { 
            logger().error(err)
        }

        return this;
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