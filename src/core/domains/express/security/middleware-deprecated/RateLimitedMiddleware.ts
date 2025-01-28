
import RateLimitedExceededError from "@src/core/domains/auth/exceptions/RateLimitedExceededError";
import { Request } from "express";
import Middleware from "@src/core/domains/express/base/Middleware";
import HttpContext from "@src/core/domains/express/data/HttpContext";
import { IPDatesArrayTTL } from "@src/core/domains/express/interfaces/ICurrentRequest";
import { requestContext } from "@src/core/domains/express/services/RequestContext";

class RateLimitedMiddleware extends Middleware {

    private limit: number;

    private perMinuteAmount: number;

    constructor(limit: number, perMinuteAmount: number) {
        super();
        this.limit = limit;
        this.perMinuteAmount = perMinuteAmount;
    }

    /**
     * Checks if the request is authorized, i.e. if the user is logged in.
     * Throws an exception on unauthorized requests.
     * @param context The HTTP context
     */
    async execute(context: HttpContext): Promise<void> {

        // Get the request
        const req = context.getRequest();

        // Get pathname from request
        const url = new URL(req.url, `http${req.secure ? 's' : ''}://${req.headers.host}`);

        // The id for the rate limited context
        const ipContextIdentifier = `rateLimited:${req.method}:${url.pathname}`

        // Update the context with a new date
        this.addDate(ipContextIdentifier, req as Request, this.perMinuteAmount * 60);

        // Get the current date
        const now = new Date();
    
        // Get date in the past
        const dateInPast = new Date();
        dateInPast.setMinutes(dateInPast.getMinutes() - this.perMinuteAmount);

        // Get an array of dates that represents that hit log
        const datesArray = this.getIpContext(ipContextIdentifier, req).value;

        // Filter down the array of dates that match our specified time from past to now
        const attemptCount = this.findDatesWithinTimeRange(dateInPast, now, datesArray);

        // If the number of requests is greater than the limit, throw an error
        if(attemptCount > this.limit) {

            // Undo the last added date, we won't consider this failed request as part of the limit
            this.removeLastDate(ipContextIdentifier, req);

            // Throw the error
            throw new RateLimitedExceededError()
        }

        // Limits not exceeded
        this.next();
    }

    /**
    * Adds a new date to the rate limited context.
    * 
     * @param ipContextIdentifier - The rate limited context id.
     * @param req - The express request object.
     * @param ttlSeconds - The ttl in seconds of the context.
     */
    protected addDate(ipContextIdentifier: string, req: Request, ttlSeconds: number) {
        const context = this.getIpContext(ipContextIdentifier, req);
        const dates = context.value

        requestContext().setByIpAddress<Date[]>(req, ipContextIdentifier, [
            ...dates,
            new Date()
        ], ttlSeconds)
    }

    /**
     * Gets the current rate limited context for the given id and request.
     * 
     * Returns an object with a "value" property containing an array of Date objects and a "ttlSeconds" property containing the TTL in seconds.
     * Example: { value: [Date, Date], ttlSeconds: 60 }
     * 
     * @param id - The rate limited context id.
     * @param req - The express request object.
     * @returns The current rate limited context value with the given id, or an empty array if none exists.
     */
    protected getIpContext(id: string, req: Request): IPDatesArrayTTL<Date[]> {
        return requestContext().getByIpAddress<IPDatesArrayTTL<Date[]>>(req, id) || { value: [], ttlSeconds: null };
    }

    /**
    * Finds the number of dates in the given array that are within the given start and end date range.
    *  
    * @param start The start date of the range.
     * @param end The end date of the range.
     * @param dates The array of dates to search through.
     * @returns The number of dates in the array that fall within the given range.
     */
    protected findDatesWithinTimeRange(start: Date, end: Date, dates: Date[]): number {
        return dates.filter((date) => {
            return date >= start && date <= end;
        }).length;
    }

    /**
     * Removes the last date from the rate limited context.
     * 
     * @param ipContextIdentifier - The rate limited context id.
     * @param req - The express request object.
     */
    protected removeLastDate(ipContextIdentifier: string, req: Request) {
        const context = this.getIpContext(ipContextIdentifier, req);
        const dates = context.value;
        const ttlSeconds = context.ttlSeconds ?? undefined;
        const newDates = [...dates];
        newDates.pop();

        requestContext().setByIpAddress<Date[]>(req, ipContextIdentifier, newDates, ttlSeconds)
    }

}

export default RateLimitedMiddleware;