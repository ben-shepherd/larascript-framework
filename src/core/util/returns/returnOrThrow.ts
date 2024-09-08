
export type ReturnOrThrow<T> = {
    shouldThrow: boolean;
    throwable: Error;
    returns?: T;
}

/**
 * Returns a value or throws an error
 * @param param0 
 * @returns 
 */
const returnOrThrow = <T>({ shouldThrow, throwable, returns }: ReturnOrThrow<T>): T => {
    if(shouldThrow && throwable) {
        throw throwable
    }
    if(returns !== undefined) {
        return returns
    }
    throw new Error('Invalid properties');
}

export default returnOrThrow