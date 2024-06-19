
import Model from '@src/core/base/Model';
import { ObjectId } from 'mongodb';

interface MovieData {
    _id: ObjectId;
    author: string;
    title: string;
    genre: string;
}

export default class Movie extends Model<MovieData> {

    fields: string[] = [
        ...this.fields,
        'author',
        'genre',
    ]

    public guarded: string[] = [
        'subscriptionId'
    ]

    getAuthor(): string | null {
        return this.data?.author ?? null
    }
}