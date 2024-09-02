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

    /**
     * Converts a string to a safe method string
     * @param str 
     * @returns 
     */
    public static readonly convertToSafeMethod = (str: string): string => {
        // Replace non alpha numeric characters to _
        // Captializes characters after the _
        // Finally replaces _ with an empty string 
        // Example: "Bad string for a class!" -> "BadStringForAClass"
        return str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_./g, x => x[1].toUpperCase()).replace('_', '');
    }
}

export default Str;