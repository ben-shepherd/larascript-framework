import { App } from "@src/core/services/App";

const cleanupCollections = async () => {
    
    const colletionsToDrop = ['tests', 'testsWorker'];

    for (const collection of colletionsToDrop) {
        await App.container('db').documentManager().table(collection).truncate();
    }
}

export default Object.freeze({
    cleanupCollections
})