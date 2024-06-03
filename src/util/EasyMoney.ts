
export default (amount: string): number => {
    return parseFloat(amount.replace(',',''))
}