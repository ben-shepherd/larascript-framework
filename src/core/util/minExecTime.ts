// eslint-disable-next-line no-unused-vars
type MinExecTimeFn<T> = (...args: any[]) => Promise<T>;

const minExecTime = async <T>(minMs: number, fn: MinExecTimeFn<T>): Promise<T> => {
    const start = Date.now();
    const result = await fn();
    const end = Date.now();
    const duration = end - start;

    if (duration < minMs) {
        await sleepMs(minMs - duration);
    }

    return result;
}

const sleepMs = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default minExecTime;
