import { askQuestion } from '../../../services/userInput';
import ui from '../../../services/ui';

export type MenuItem = {
    label: string;
    onSelect: () => Promise<void>;
}
type Props = {
    items: MenuItem[]
}

const MenuView = ({ items }: Props): void => {
    function onSelect(option: string): void {
        const index = parseInt(option);
        const item = items[index - 1] ?? null;

        if (!item) {
            console.log('Invalid option');
            renderOutput();
            return; 
        }

        item.onSelect();
    }

    const renderOutput = async () => {
        ui.clear();
        for(let item of items) {
            console.log(`${items.indexOf(item) + 1}. ${item.label}`);
        }
        const option = await askQuestion('Select an option: ');
        onSelect(option);
    }

    renderOutput();
}

export default MenuView