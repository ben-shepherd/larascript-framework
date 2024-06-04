import { FleaListingItem } from "../types/types.t"

type Props = {
    item: FleaListingItem
}

const FleaListingItemView = ({ item }: Props): void => {
    const results = (await storage.load() as FleaListingItem[])
    .filter((item) => item.name === selectedName)
    .sort((a, b) => a.sellPrice - b.sellPrice)
    
    const rows: string[][] = [];

    for(const item of results) {
        let profits = '';
        item.profits.map((profit) => {
            profits += `Buy at ${toRubles(profit.profit)} for ${profit.percent}% profit\n`;
        })
        rows.push([item.name, toRubles(item.sellPrice), toRubles(item.sellFee), profits])
    }

    ui.table({
        head: ['Name', 'Sell Price', 'Sell Fee', 'Profits']
    }, rows)
}

export default FleaListingItemView