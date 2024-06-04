import getStorage from "../../../services/getStorage"

type Setting = {
    previousItemName?: string | null
    previousItemName2nd?: string | null
    previousItemName3rd?: string | null
}
type Return = {
    load: () => Promise<Setting>
    set: (key: keyof Setting, value: string | number | boolean | null) => Promise<void>
    setPreviousItem: (itemName: string) => Promise<void>
}

const fleaListingSettings = (): Return => {
    const storage = getStorage({ ref: 'fleaListingsSettings', fileName: 'fleaListingsSettings.json' })

    const load = async (): Promise<Setting> => {
        return await storage.load() ?? {} as Setting
    }

    const set = async(key: keyof Setting, value: string | number | boolean | null): Promise<void> => {
        const current = await load()

        await storage.save({
            ...current,
            [key]: value
        })
    }


    const setPreviousItem = async (itemName: string): Promise<void> => {
        const currentData = await load()
        await set('previousItemName', itemName)
        await set('previousItemName2nd', currentData?.previousItemName ?? null)
        await set('previousItemName3rd', currentData?.previousItemName2nd ?? null)
    }

    return {
        load,
        set,
        setPreviousItem,
    }
}

export default fleaListingSettings;