class Str {
    /**
     * Pluralizes a string
     * @param str 
     * @returns 
     */
    public static readonly plural = (str: string): string => {
        if(!str.endsWith('s')) {
            return `${str}s`;
        }

        return `${str}s`;
    }

    /**
     * Starts a string with lowercase
     * @param str 
     * @returns 
     */
    public static readonly startLowerCase = (str: string): string => {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    /**
     * Starts a string with uppercase
     * @param str 
     * @returns 
     */
    public static readonly startWithUppercase = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Starts a string with lowercase
     * @param str 
     * @returns 
     */
    public static readonly startWithLowercase = (str: string): string => {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    /**
     * Camel cases a string
     * @param str 
     * @returns 
     */
    public static readonly camelCase = (str: string): string => {
        return str
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/\s+/g, '');
    }
}

export default Str;