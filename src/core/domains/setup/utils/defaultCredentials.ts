import { App } from "@src/core/services/App"
import fs from "fs"
import path from "path"

/**
 * Extracts the default MongoDB credentials from the `docker-compose.mongodb.yml` file.
 */
const extractDefaultMongoDBCredentials = () => {
    try {
        const dockerComposePath = path.resolve('@src/../', 'docker/docker-compose.mongodb.yml')
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

/**
 * Extracts the default Postgres credentials from the `docker-compose.postgres.yml` file.
 * @returns 
 */
const extractDefaultPostgresCredentials = () => {
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

export default Object.freeze({
    extractDefaultMongoDBCredentials,
    extractDefaultPostgresCredentials
})