/**
 * Utility functions for UUID validation and manipulation
 */

// UUID v4 regex pattern
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Checks if a given value is a valid UUID v4 string
 * @param value The value to check
 * @returns boolean indicating if the value is a valid UUID v4
 */
export function isUuid(value: unknown): boolean {
    if (value === undefined || value === null) {
        return false;
    }

    if (typeof value !== 'string') {
        return false;
    }

    return UUID_V4_REGEX.test(value);
}

/**
 * Validates a UUID and throws an error if invalid
 * @param value The UUID to validate
 * @throws Error if the UUID is invalid
 */
export function validateUuid(value: unknown): void {
    if (!isUuid(value)) {
        throw new Error('Invalid UUID format');
    }
}

export default {
    isUuid,
    validateUuid
}; 