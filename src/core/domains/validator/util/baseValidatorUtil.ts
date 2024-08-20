import Joi, { ValidationError, ValidationErrorItem } from "joi";

/**
 * Formats a Joi validation result into a ValidationError, by combining Joi validation errors and custom messages
 * 
 * @param customMessages 
 * @param result 
 * @returns 
 */
const formatErrors = (customMessages: Record<string, string>, result: Joi.ValidationResult): ValidationError | undefined =>
{
    let customizedError: ValidationError | undefined;

    const errorDetails: ValidationErrorItem[] = [];

    // Add Joi validation errors
    if (result.error) {
        errorDetails.push(...result.error.details.map(detail => ({
            ...detail,
            message: customMessages[detail.type] || detail.message
        })));
    }

    // Add custom messages that don't correspond to Joi errors
    for (const [key, message] of Object.entries(customMessages)) {
        if (!errorDetails.some(detail => detail.type === key)) {
            errorDetails.push({
                message,
                path: [],
                type: key,
                context: {
                    key: key
                }
            } as ValidationErrorItem);
        }
    }

    if (errorDetails.length > 0) {
        customizedError = new Joi.ValidationError(
            'Validation failed',
            errorDetails,
            result.value
        );
    }

    return customizedError;
}

export default Object.freeze({
    formatErrors
})