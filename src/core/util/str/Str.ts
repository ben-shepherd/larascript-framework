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
}

export default Str;