
/**
 * Replaces a property in the .env content string with a new value
 * 
 * @param key 
 * @param value 
 * @param content 
 * @returns 
 */
const replaceEnvValue = (key: string, value: string, content: string): string => {
    const pattern = new RegExp(`(${key}=.*)`, 'g');
    const regex = content.match(pattern);

    if (regex?.[0]) {
        content = content.replace(regex[0], `${key}=${value}`);
    }
    
    return content;
}

export default replaceEnvValue;