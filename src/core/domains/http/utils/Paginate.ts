import { Request } from "express";

export type ParseRequestOptions = {
    allowPageSizeOverride?: boolean
}

/**
 * Paginate class
 * 
 * A utility class for handling pagination in HTTP requests. It extracts and manages
 * pagination parameters (page number and page size) from Express request query strings.
 * 
 * Example usage:
 * ```ts
 * const paginate = new Paginate();
 * paginate.parseRequest(req);
 * 
 * const page = paginate.getPage(); // Gets current page, defaults to 1
 * const pageSize = paginate.getPageSize(10); // Gets page size with default of 10
 * ```
 * 
 * The class supports:
 * - Parsing page and pageSize from request query parameters
 * - Configurable page size override through options
 * - Default values for both page and pageSize
 * - Method chaining for fluent API usage
 */
class Paginate {

    protected page: number | undefined = undefined

    protected pageSize: number | undefined = undefined;

    /**
     * Parses the request object to extract the page and pageSize from the query string
     * 
     * @param {Request} req - The Express Request object
     * @returns {this} - The Paginate class itself to enable chaining
     */
    parseRequest(req: Request, options: ParseRequestOptions = { allowPageSizeOverride: true }): this {
        if(req.query?.page) {
            this.page = parseInt(req.query?.page as string);
        }       

        if(options.allowPageSizeOverride && req.query?.pageSize) {
            this.pageSize = parseInt(req.query?.pageSize as string);
        }       

        return this
    }

    /**
     * Gets the page number, defaulting to 1 if undefined.
     * @param {number} defaultValue - The default value if this.page is undefined.
     * @returns {number} - The page number.
     */
    getPage(defaultValue: number = 1): number {
        return this.page ?? defaultValue
    }

    /**
     * Gets the page size, defaulting to the defaultValue if undefined.
     * @param {number} [defaultValue=undefined] - The default value if this.pageSize is undefined.
     * @returns {number | undefined} - The page size.
     */
    getPageSize(defaultValue?: number): number | undefined {
        return this.pageSize ?? defaultValue
    }

}

export default Paginate