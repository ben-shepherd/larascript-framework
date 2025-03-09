/* eslint-disable no-unused-vars */
export interface IDispatchable
{
    dispatch(...args: unknown[]): Promise<unknown>;
}