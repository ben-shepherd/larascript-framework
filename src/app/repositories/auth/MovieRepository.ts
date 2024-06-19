import MovieModel from "@src/app/models/Movie";
import Repository from "@src/core/base/Repository";

export default class MovieRepository extends Repository<MovieModel>
{
    constructor() {
        super('movies', Movie)
    }

    findByAuthor(author: string) {
        return this.findOne({author})
    }

    findComedies() {
        return this.findMany({genre: 'Comedy'}, {
            sort: {
                createdAt: 'descending'
            }
        })
    }
}