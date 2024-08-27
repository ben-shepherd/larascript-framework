import fs from "fs"
import path from "path"

const extractDefaultMongoDBCredentials = () => {
    try {
        const dockerComposePath = path.resolve('@src/../', 'docker-compose.mongodb.yml')
        const contents = fs.readFileSync(dockerComposePath, 'utf8')

        const pattern = /MONGODB_URI=(.+)/
        const match = pattern.exec(contents)

        if (match?.[1]) {
            return match?.[1]
        }
    }
    catch (err) {
        console.error(err)
    }

    return null;
}

export default Object.freeze({
    extractDefaultMongoDBCredentials,
})