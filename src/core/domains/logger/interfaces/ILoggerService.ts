/* eslint-disable no-unused-vars */
import winston from "winston";

export interface ILoggerService
{
    getLogger(): winston.Logger;
    
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
    verbose(...args: any[]): void;
    console(...args: any[]): void;
    exception(err: Error): void;
}