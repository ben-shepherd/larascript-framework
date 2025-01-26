export interface IExpressable<T = unknown> {
    // eslint-disable-next-line no-unused-vars
    toExpressable(...args: any[]): T
}