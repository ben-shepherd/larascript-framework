import { FleaListingItem, FleaProfit } from "../types/types.t";

const percentageIncrements = [5,15,25,50,75]

type Props = {
    name?: string,
    sellPrice?: number;
    sellFee?: number;
}
export default ({ name = '', sellPrice = 0, sellFee = 0 }: Props = {}): FleaListingItem => {
    const generateFleaProfits = (data: FleaListingItem): FleaListingItem => {
        const profits: FleaProfit[] = [];
    
        for(let percent of percentageIncrements) {
            const buyPrice = data.sellPrice - (data.sellPrice * percent / 100);
            const profit = data.sellTotal - buyPrice;
    
            profits.push({
                buyPrice,
                profit,
                percent,
            })
        }
    
        return {
            ...data,
            profits
        }
    }

    
    return generateFleaProfits({
        name,
        sellPrice,
        sellFee,
        sellTotal: sellPrice + sellFee,
        profits: []
    })
}