const isTruthy = (value: unknown): boolean => {
    return value === true || value === 'true' || value === 1 || value === '1' || value === 'yes' || value === 'on';
}

export default isTruthy;


