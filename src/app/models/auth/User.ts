import Model from '@src/core/base/Model';
import IUserModel, { IUserData } from '@src/core/domains/auth/interfaces/IUserModel';
import ApiToken from '@src/app/models/auth/ApiToken';

export default class User extends Model<IUserData> implements IUserModel {

    public collection: string = 'users';

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
        /** Define your user fields below */
        'email',
        'hashedPassword',
        'roles',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
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