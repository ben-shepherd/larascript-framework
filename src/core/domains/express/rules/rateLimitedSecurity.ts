import RateLimitedExceededError from "@src/core/domains/auth/exceptions/RateLimitedExceededError";
import { IPDatesArrayTTL } from "@src/core/domains/express/interfaces/ICurrentRequest";
import { BaseRequest } from "@src/core/domains/express/types/BaseRequest.t";
import { App } from "@src/core/services/App";
import { Request } from "express";

/**
 * Adds a new date to the rate limited context.
 * 
 * @param ipContextIdentifier - The rate limited context id.
 * @param req - The express request object.
 * @param ttlSeconds - The ttl in seconds of the context.
 */
const addDate = (ipContextIdentifier: string, req: Request, ttlSeconds: number) => {
    const context = getContext(ipContextIdentifier, req);
    const dates = context.value

    App.container('requestContext').setByIpAddress<Date[]>(req, ipContextIdentifier, [
        ...dates,
        new Date()
    ], ttlSeconds)
}

/**
 * Removes the last date from the rate limited context.
 * 
 * @param ipContextIdentifier - The rate limited context id.
 * @param req - The express request object.
 */
const removeLastDate = (ipContextIdentifier: string, req: Request) => {
    const context = getContext(ipContextIdentifier, req);
    const dates = context.value;
    const ttlSeconds = context.ttlSeconds ?? undefined;
    const newDates = [...dates];
    newDates.pop();

    App.container('requestContext').setByIpAddress<Date[]>(req, ipContextIdentifier, newDates, ttlSeconds)
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
const getContext = (id: string, req: Request): IPDatesArrayTTL<Date[]> => {
    return App.container('requestContext').getByIpAddress<IPDatesArrayTTL<Date[]>>(req, id) || { value: [], ttlSeconds: null };
}

/**
 * Finds the number of dates in the given array that are within the given start and end date range.
 * 
 * @param start The start date of the range.
 * @param end The end date of the range.
 * @param dates The array of dates to search through.
 * @returns The number of dates in the array that fall within the given range.
 */
const findDatesWithinTimeRange = (start: Date, end: Date, dates: Date[]): number => {
    return dates.filter((date) => {
        return date >= start && date <= end;
    }).length;
}

/**
 * Checks if the current request has exceeded the given rate limit per minute.
 * 
 * @param req The request to check.
 * @param limitPerMinute The maximum number of requests the user can make per minute.
 * @returns true if the request has not exceeded the rate limit, false otherwise.
 * @throws RateLimitedExceededError if the rate limit has been exceeded.
 */
const rateLimitedSecurity = (req: BaseRequest, limit: number, perMinuteAmount: number = 1): boolean => {

    // Get pathname from request
    const url = new URL(req.url, `http${req.secure ? 's' : ''}://${req.headers.host}`);

    // The id for the rate limited context
    const ipContextIdentifier = `rateLimited:${req.method}:${url.pathname}`

    // Update the context with a new date
    addDate(ipContextIdentifier, req, perMinuteAmount * 60);

    // Get the current date
    const now = new Date();
    
    // Get date in the past
    const dateInPast = new Date();
    dateInPast.setMinutes(dateInPast.getMinutes() - perMinuteAmount);

    // Get an array of dates that represents that hit log
    const datesArray = getContext(ipContextIdentifier, req).value;

    // Filter down the array of dates that match our specified time from past to now
    const attemptCount = findDatesWithinTimeRange(dateInPast, now, datesArray);

    // If the number of requests is greater than the limit, throw an error
    if(attemptCount > limit) {

        // Undo the last added date, we won't consider this failed request as part of the limit
        removeLastDate(ipContextIdentifier, req);

        // Throw the error
        throw new RateLimitedExceededError()
    }

    // Limits not exceeded
    return true;
}

export default rateLimitedSecurity