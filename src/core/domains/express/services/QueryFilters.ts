import Singleton from "@src/core/base/Singleton";
import { SearchOptions } from "@src/core/domains/express/interfaces/IRouteResourceOptions";
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
            const decodedQuery = decodeURIComponent(req.query?.filters as string ?? '');
            const filtersParsed: object = JSON.parse(decodedQuery ?? '{}');
            let filters: object = {};

            fields.forEach((field: string) => {
                if (field in filtersParsed) {
                    filters = {
                        ...filters,
                        [field]: filtersParsed[field]
                    }
                }
            })
            
            this.filters = filters
        }
         
        catch (err) { 
            console.error(err)
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