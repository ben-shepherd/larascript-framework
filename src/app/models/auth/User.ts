import Model from '@src/core/base/Model';
import IUserModel from '@src/core/domains/auth/interfaces/IUserModel';
import { ObjectId } from 'mongodb';
import ApiToken from './ApiToken';

export interface UserData {
    _id?: ObjectId
    email: string
    hashedPassword: string
    roles: string[],
    firstName?: string;
    lastName?: string;
}

export default class User extends Model<UserData> implements IUserModel {

    /**
     * Protected fields
     */
    guarded: string[] = [
        ...this.guarded
    ];

    /**
     * Define your user fields that can be set
     */
    fields: string[] = [
        ...this.fields,
        /** Define your user fields below */
        'firstName',
        'lastName',
    ]

    tokens(): Promise<ApiToken[]> 
    {
        return this.hasMany({
            localModel: this,
            localKey: '_id',
            foreignKey: 'userId',
            foreignModelCtor: ApiToken

        })    
    }
}