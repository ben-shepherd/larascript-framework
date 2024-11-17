import { App } from "@src/core/services/App"
import fs from "fs"
import path from "path"

export const extractDefaultPostgresCredentials = () => {
    try {
        const dockerComposePath = path.resolve('@src/../', 'docker/docker-compose.postgres.yml')
        const contents = fs.readFileSync(dockerComposePath, 'utf8')

        const pattern = /LARASCRIPT_DEFAULT_CREDENTIALS:\s?(.+)/
        const match = pattern.exec(contents)

        if (match?.[1]) {
            return match?.[1]
        }
    }
    catch (err) {
        App.container('logger').error(err)
    }

    return null;
}