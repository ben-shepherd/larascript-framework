import Singleton from "@src/core/base/Singleton";
import { Request } from "express";

export type ParseRequestOptions = {
    allowPageSizeOverride?: boolean
}

class Paginate extends Singleton {

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