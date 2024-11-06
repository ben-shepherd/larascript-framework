/* eslint-disable no-unused-vars */
export interface IExecutable
{
    execute(...args: any[]): Promise<void>;
}