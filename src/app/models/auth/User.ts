import ApiToken from '@src/app/models/auth/ApiToken';
import UserObserver from '@src/app/observers/UserObserver';
import Model from '@src/core/base/Model';
import IUserModel, { IUserData } from '@src/core/domains/auth/interfaces/IUserModel';

export default class User extends Model<IUserData> implements IUserModel {

    public collection: string = 'users';


    constructor(data: IUserData | null = null) {
        super(data);
        this.observeWith(UserObserver);
    }

    /**
     * Guarded fields
     */
    guarded: string[] = [
        'hashedPassword',
        'password',
        'roles'
    ];

    /**
     * Define your user fields that can be set
     */
    fields: string[] = [
        /** Define your user fields below */
        'email',
        'password',
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
            localKey: 'id',
            foreignKey: 'userId',
            foreignModelCtor: ApiToken
        })    
    }
}