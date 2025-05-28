/* eslint-disable no-unused-vars */

export interface IUseCase<T = unknown,R = unknown> {
    invoke(...args: T[]): Promise<R>
}