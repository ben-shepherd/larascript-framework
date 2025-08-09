import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { cryptoService } from "@src/core/domains/crypto/service/CryptoService";
import { app } from "@src/core/services/App";

class GenerateAppKey extends BaseCommand {

    signature = 'app:generate-key'

    description = 'Generate a new app key'

    async execute() {

        const confirm = await this.input.askQuestion('Are you sure you want to generate a new app key? (y/n)')

        if (confirm !== 'y') {
            console.log('App key generation cancelled.')
            return
        }

        console.log('Generating app key...')

        const appKey = cryptoService().generateAppKey()

        await app('envService').updateValues({
            APP_KEY: appKey
        })

        console.log(`App key generated: ${appKey}`)
    }

}

export default GenerateAppKey
