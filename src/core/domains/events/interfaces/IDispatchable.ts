/* eslint-disable no-unused-vars */
export interface IDispatchable
{
    dispatch(...arg: any[]): Promise<void>;
}