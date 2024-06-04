import { TableData } from "../types/table.t";
import Table from 'cli-table3';

type Props = {
    data?: TableData[];
}

const TableView = ({ data = [] }: Props): void =>  {
    if(!data.length) {
        return TableViewEmpty();
    }

    const table = new Table({
        head: ['Sell Price', 'Fee', 'Ideal Buy Price', 'Profit'],
        colWidths: [15, 10, 20, 10]
    });

    data.forEach(item => {
        table.push([item.sellPrice, item.fee, item.idealBuyPrice, item.profit]);
    });

    console.log(table.toString());    
}

const TableViewEmpty = (): void => {
    const table = new Table({
        head: ['There is no data available'],
        colWidths: [35]
    });

    console.log(table.toString());    
}

export default TableView