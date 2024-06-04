import getStorage from '../../../services/getStorage';
import ui from '../../../services/ui';
import { askQuestion, pressEnterToContinue } from '../../../services/userInput';
import EasyMoney from '../../../util/EasyMoney';
import toRubles from '../../../util/toRubles';
import FleaListingItemFactory from '../factory/FleaListingItemFactory';
import fleaListingSettings from '../settings/fleaListingSettings';
import { FleaListingItem } from '../types/types.t';
import MenuView, { MenuItem } from '../views/MenuView';

const fleaListings = (): void => {
    const storage = getStorage({ ref: 'fleaListings', fileName: 'fleaListings.json' });
    const settings = fleaListingSettings();

    /**
     * The flea makert item.
     */
    let selectedName: string | null = null;

    const handleUsePreviousName = async (option: 1 | 2 | 3) => {
        const settingsData = await settings.load();
        if(option === 1) {
            selectedName = settingsData?.previousItemName ?? null;        
        }
        else if(option === 2) {
            selectedName = settingsData?.previousItemName2nd ?? null;
        }
        else if(option === 3) {
            selectedName = settingsData?.previousItemName3rd ?? null;
        }
    
        renderMenu()
    }

    const handleSelectItemByName = async () => {
        selectedName = await askQuestion('Enter Item Name: ');
        // await settings.setPreviousItem(selectedName)
        renderMenu()
    }

    const handleCreateFleaListingItem = async () => {

        ui.clear();
        const name = selectedName ?? '';
        const sellPrice = EasyMoney(await askQuestion('Enter Sell Price: '));
        const sellFee = EasyMoney(await askQuestion('Enter Fee: '));

        if(!name.length) throw new Error('name cannot be empty');
        
        const fleaListingItem = FleaListingItemFactory({
            name,
            sellPrice,
            sellFee
        })

        await storage.saveAppend([fleaListingItem]);
        renderMenu()
        
    }

    const handleOnClear = async () => {

        const confirm = await askQuestion('Are you sure you want to clear listings? (y/n): ');

        if (confirm !== 'y') {
            renderMenu()
            return;
        }
        
        await storage.save([]);

        console.log('Cleared listings');

        setTimeout(() => {
            renderMenu()
        }, 2500)
    
    }

    const handleViewListingItems = async () => {
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

        pressEnterToContinue(() => renderMenu());
    }

    const buildMenu = async (): Promise<MenuItem[]> => {
        const settingsData = await settings.load();
        const previousItemName = settingsData?.previousItemName ?? null;
        const previousItemName2nd = settingsData?.previousItemName2nd ?? null;
        const previousItemName3rd = settingsData?.previousItemName3rd ?? null;

        const menuUsePreviousItemName = {
            label: previousItemName 
                ? 'Use previous item (' + previousItemName + ')' 
                : '',
            onSelect: () => handleUsePreviousName(1),
        }
        const menuUsePreviousItemName2nd = {
            label: previousItemName 
                ? 'Use previous item (' + previousItemName2nd + ')' 
                : '',
                onSelect: () => handleUsePreviousName(2),
        }
        const menuUsePreviousItemName3rd = {
            label: previousItemName 
                ? 'Use previous item (' + previousItemName3rd + ')' 
                : '',
                onSelect: () => handleUsePreviousName(3),
        }
        
        const menuSelectName = {
            label: 'Enter Item Name',
            onSelect: handleSelectItemByName
        }
        const menuCreateFleaListingItem = {
            label: 'Add Selling Fee',
            onSelect: handleCreateFleaListingItem
        }
        const menuViewFleaListingItem = {
            label: 'View',
            onSelect: handleViewListingItems
        }
        const menuClear = {
            label: 'Clear data',
            onSelect: handleOnClear
        }
        
        return [
            menuUsePreviousItemName,
            menuUsePreviousItemName2nd,
            menuUsePreviousItemName3rd,
            menuSelectName,
            menuCreateFleaListingItem,
            menuViewFleaListingItem,
            menuClear
        ]
    }

    const renderSelectedNameAsTable = async () => {
        
        if(typeof selectedName !== 'string') return;

        ui.table({
            head: ['Item Selected']
        }, [
            [selectedName]
        ])
    }

    const renderMenu = async (): Promise<void> => {
        renderSelectedNameAsTable()

        MenuView({
            items: await buildMenu(),
        })
    }

    renderMenu()
}

export default fleaListings 