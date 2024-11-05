import CastException from "../exceptions/CastException";
import { IHasCastableConcern, TCastableType } from "../interfaces/concerns/IHasCastableConcern";
import { ICtor } from "../interfaces/ICtor";

const HasCastableConcernMixin = (Base: ICtor) => {
    return class HasCastableConcern extends Base implements IHasCastableConcern {

        casts: Record<string, TCastableType> = {};

        /**
         * Casts each property of the given data object according to the types specified in the casts record.
         * @template ReturnType The return type of the casted object
         * @param {Record<string, unknown>} data - The object containing data to be casted
         * @returns {ReturnType} The object with its properties casted to the specified types
         */
        getCastFromObject<ReturnType = unknown>(data: Record<string, unknown>): ReturnType {
            for(const [key, type] of Object.entries(this.casts)) {
                if (key in data) {
                    data[key] = this.getCast(data[key], type);
                }
            }

            return data as ReturnType;
        }

        /**
         * Casts the given data to the specified type.
         * @template T The type to cast to
         * @param {unknown} data - The data to cast
         * @param {TCastableType} type - The target type for casting
         * @returns {T} The casted data
         * @throws {CastException} If the cast operation fails or is invalid
         */
        getCast<T = unknown>(data: unknown, type: TCastableType): T {
            if (!this.isValidType(type)) {
                throw new CastException(`Invalid cast type: ${type}`);
            }

            if (data === null || data === undefined) {
                if (type === 'null') return null as T;
                if (type === 'undefined') return undefined as T;
                throw new CastException(`Cannot cast null/undefined to ${type}`);
            }

            try {
                switch (type) {
                case 'string': return this.castString(data);
                case 'number': return this.castNumber(data);
                case 'boolean': return this.castBoolean(data);
                case 'array': return this.castArray(data);
                case 'object': return this.castObject(data);
                case 'date': return this.castDate(data);
                case 'integer': return this.castInteger(data);
                case 'float': return this.castFloat(data);
                case 'bigint': return this.castBigInt(data);
                case 'map': return this.castMap(data);
                case 'set': return this.castSet(data);
                case 'symbol': return Symbol(String(data)) as unknown as T;
                default:
                    throw new CastException(`Unsupported cast type: ${type}`);
                }
            }
            catch (error) {
                throw new CastException(`Cast failed: ${(error as Error).message}`);
            }
        }

        /**
         * Validates if the given type is a supported castable type
         * @param {TCastableType} type - The type to validate
         * @returns {boolean} True if the type is valid, false otherwise
         */
        isValidType(type: TCastableType): boolean {
            const validTypes: TCastableType[] = [
                'string', 'number', 'boolean', 'array', 'object', 'date',
                'integer', 'float', 'bigint', 'null', 'undefined', 'symbol',
                'map', 'set'
            ];
            return validTypes.includes(type);
        }

        /**
         * Validates if a string represents a valid date
         * @param {string} date - The date string to validate
         * @returns {boolean} True if the string is a valid date, false otherwise
         * @private
         */
        private isValidDate(date: string): boolean {
            const timestamp = Date.parse(date);
            return !isNaN(timestamp);
        }

        /**
         * Casts data to a string
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a string
         * @throws {CastException} If the cast operation fails
         * @private
         */
        private castString<T = unknown>(data: unknown): T {
            if (data instanceof Date) {
                return data.toISOString() as unknown as T;
            }
            if (typeof data === 'object') {
                return JSON.stringify(data) as unknown as T;
            }
            return String(data) as unknown as T;
        }

        /**
         * Casts data to a number
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a number
         * @throws {CastException} If the data cannot be converted to a number
         * @private
         */
        private castNumber<T = unknown>(data: unknown): T {
            if (typeof data === 'string') {
                const num = Number(data);
                if (isNaN(num)) throw new CastException('Invalid number string');
                return num as unknown as T;
            }
            if (data instanceof Date) {
                return data.getTime() as unknown as T;
            }
            return Number(data) as unknown as T;
        }

        /**
         * Casts data to a boolean
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a boolean
         * @throws {CastException} If the data cannot be converted to a boolean
         * @private
         */
        private castBoolean<T = unknown>(data: unknown): T {
            if (typeof data === 'string') {
                const lowercased = data.toLowerCase();
                if (['true', '1', 'yes'].includes(lowercased)) return true as unknown as T;
                if (['false', '0', 'no'].includes(lowercased)) return false as unknown as T;
                throw new CastException('Invalid boolean string');
            }
            return Boolean(data) as unknown as T;
        }

        /**
         * Casts data to an array
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as an array
         * @throws {CastException} If the data cannot be converted to an array
         * @private
         */
        private castArray<T = unknown>(data: unknown): T {
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data) as unknown as T;
                }
                catch {
                    return [data] as unknown as T;
                }
            }
            if (data instanceof Set || data instanceof Map) {
                return Array.from(data) as unknown as T;
            }
            if (Array.isArray(data)) return data as T;
            return [data] as unknown as T;
        }

        /**
         * Casts data to an object
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as an object
         * @throws {CastException} If the data cannot be converted to an object
         * @private
         */
        private castObject<T = unknown>(data: unknown): T {
            if (typeof data === 'string') {
                try {
                    return JSON.parse(data) as T;
                }
                catch (error) {
                    throw new CastException('Invalid JSON string for object conversion');
                }
            }
            if (Array.isArray(data) || data instanceof Set || data instanceof Map) {
                return Object.fromEntries(
                    Array.from(data).map((val, idx) => [idx, val])
                ) as unknown as T;
            }
            return Object(data) as T;
        }

        /**
         * Casts data to a Date object
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a Date object
         * @throws {CastException} If the data cannot be converted to a Date
         * @private
         */
        private castDate<T = unknown>(data: unknown): T {
            if (data instanceof Date) return data as T;
            if (typeof data === 'number') {
                return new Date(data) as unknown as T;
            }
            if (typeof data === 'string' && this.isValidDate(data)) {
                return new Date(data) as unknown as T;
            }
            throw new CastException('Invalid date format');
        }

        /**
         * Casts data to an integer
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as an integer
         * @throws {CastException} If the data cannot be converted to an integer
         * @private
         */
        private castInteger<T = unknown>(data: unknown): T {
            const int = parseInt(String(data), 10);
            if (isNaN(int)) throw new CastException('Invalid integer');
            return int as unknown as T;
        }

        /**
         * Casts data to a float
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a float
         * @throws {CastException} If the data cannot be converted to a float
         * @private
         */
        private castFloat<T = unknown>(data: unknown): T {
            const float = parseFloat(String(data));
            if (isNaN(float)) throw new CastException('Invalid float');
            return float as unknown as T;
        }

        /**
         * Casts data to a BigInt
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a BigInt
         * @throws {CastException} If the data cannot be converted to a BigInt
         * @private
         */
        private castBigInt<T = unknown>(data: unknown): T {
            if (typeof data === 'string' || typeof data === 'number') {
                try {
                    return BigInt(data) as unknown as T;
                }
                catch {
                    throw new CastException('Cannot convert to BigInt');
                }
            }
            throw new CastException('Cannot convert to BigInt');
        }

        /**
         * Casts data to a Map
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a Map
         * @throws {CastException} If the data cannot be converted to a Map
         * @private
         */
        private castMap<T = unknown>(data: unknown): T {
            if (data instanceof Map) return data as T;
            throw new CastException('Cannot convert to Map');
        }

        /**
         * Casts data to a Set
         * @template T The return type
         * @param {unknown} data - The data to cast
         * @returns {T} The data as a Set
         * @throws {CastException} If the data cannot be converted to a Set
         * @private
         */
        private castSet<T = unknown>(data: unknown): T {
            if (data instanceof Set) return data as T;
            if (Array.isArray(data)) {
                return new Set(data) as unknown as T;
            }
            return new Set([data]) as unknown as T;
        }
    
    }
}

export default HasCastableConcernMixin;