import { app } from "@src/core/services/App"

const captureError = async <T>(callbackFn: () => Promise<T>): Promise<T> => {
    try {
        return await callbackFn()
    }
    catch (err) {
        if (err instanceof Error && err?.message) {
            app('logger').error(`): `, err.message, err.stack)
        }
        throw err
    }
}

export default captureError