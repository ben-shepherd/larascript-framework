export type FleaProfit = {
    buyPrice: number;
    profit: number;
    percent: number;
}

export type FleaListingItem = {
    name: string;
    sellPrice: number;
    sellFee: number;
    sellTotal: number;
    profits: FleaProfit[]
}
