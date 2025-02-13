import { EnvironmentProduction } from '@src/core/consts/Environment';
import { App } from '@src/core/services/App';
import { NextFunction, Request, Response } from 'express';

/**
 * Handle 404 errors - this middleware should be added after all routes
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Invalid route`);
    res.status(404);
    next(error);
};

/**
 * Global error handler middleware
 * 
 * This middleware:
 * - Handles all errors passed to next()
 * - Returns appropriate error responses
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    if(App.env() === EnvironmentProduction) {
        res.status(statusCode).json({
            message: 'Whoops... something went wrong.',
        });
        return;
    }

    const formattedStack = err.stack
        ?.split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    res.status(statusCode).json({
        message: err.message,
        stack: formattedStack
    });
};

export default {
    notFoundHandler,
    errorHandler
};

