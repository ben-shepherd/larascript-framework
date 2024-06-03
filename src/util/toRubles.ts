
export default (amount: number): string => {
    return `₽${amount.toFixed(2)}`
}