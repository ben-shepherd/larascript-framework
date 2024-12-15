import Singleton from "@src/core/base/Singleton";
import { SearchOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
import { App } from "@src/core/services/App";
import { Request } from "express";

class QueryFilters extends Singleton {

    protected filters: object | undefined = undefined


    /**
     * Parses the request object to extract the filters from the query string
     * 
     * @param {Request} req - The Express Request object
     * @returns {this} - The QueryFilters class itself to enable chaining
     */
    parseRequest(req: Request, options: SearchOptions = {} as SearchOptions): this {
        try {
            const { fields = [] } = options;
            let decodedFilters: object = {};

            if(typeof req.query.filters === 'string') {
                decodedFilters = JSON.parse(decodeURIComponent(req.query?.filters as string ?? '')) ?? {};
            }
            else if(typeof req.query.filters === 'object') {
                decodedFilters = req.query?.filters ?? {};
            }
            else {
                decodedFilters = {};
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
            App.container('logger').error(err)
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