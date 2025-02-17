import EnvService from "@src/core/services/EnvService";

import BaseCommand from "../../console/base/BaseCommand";
import { cryptoService } from "../service/CryptoService";

class GenerateAppKey extends BaseCommand {

    signature = 'app:generate-key'

    description = 'Generate a new app key'

    envService = new EnvService();

    async execute() {

        const confirm = await this.input.askQuestion('Are you sure you want to generate a new app key? (y/n)')

        if (confirm !== 'y') {
            console.log('App key generation cancelled.')
            return
        }

        console.log('Generating app key...')

        const appKey = cryptoService().generateAppKey()

        await this.envService.updateValues({
            APP_KEY: appKey
        })

        console.log(`App key generated: ${appKey}`)
    }

}

export default GenerateAppKey
