import Model from '@src/core/base/Model';
import { ObjectId } from 'mongodb';
import MovieObserver from '../observers/MovieObserver';

export interface MovieData {
    _id?: ObjectId;
    subscriptionId: string;
    author: string;
    genre: string;
}

export default class Movie extends Model<MovieData> {

    fields: string[] = [
        ...this.fields,
        'subscriptionId',
        'author',
        'genre',
    ]

    observeProperties = {
        author: 'onAuthorChanged'
    }

    constructor(data: MovieData | null) {
        super(data)
        this.observeWith(MovieObserver)
    }

    getAuthor(): string | null {
        return this.data?.author ?? null
    }

}