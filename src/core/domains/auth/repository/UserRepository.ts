import Repository from "@src/core/base/Repository";
import { IUserModel } from "@src/core/domains/auth/interfaces/models/IUserModel";
import { IUserRepository } from "@src/core/domains/auth/interfaces/repository/IUserRepository";
import AuthUser from "@src/core/domains/auth/models/AuthUser";
import { queryBuilder } from "@src/core/domains/eloquent/services/EloquentQueryBuilderService";
import { ModelConstructor } from "@src/core/interfaces/IModel";

/**
 * Repository class for managing user data operations
 * 
 * This repository extends the base Repository class and implements IUserRepository interface.
 * It provides methods for creating, finding and managing user records in the database.
 * 
 * Key features:
 * - Create new user records
 * - Find users by ID with optional fail behavior
 * - Find users by email
 * - Uses Eloquent query builder for database operations
 * 
 * @extends Repository<IUserModel>
 * @implements IUserRepository
 */

class UserRepository extends Repository<IUserModel> implements IUserRepository {

    constructor(userModel?: ModelConstructor<IUserModel>) {
        super(userModel ?? AuthUser);
    }

    /**
     * Create a new user record
     * 
     * @param attributes - The attributes for the new user record
     * @returns The newly created user record
     */
    create(attributes: IUserModel | null = null): IUserModel {
        return this.modelConstructor.create(attributes)
    }

    /**
     * Find a user by their ID
     * 
     * @param id - The ID of the user to find
     * @returns The user record or null if not found
     */
    async findById(id: string | number): Promise<IUserModel | null> {
        return await queryBuilder(this.modelConstructor).find(id)
    }

    /**
     * Find a user by their ID and fail if not found
     * 
     * @param id - The ID of the user to find
     * @returns The user record
     */
    async findByIdOrFail(id: string | number): Promise<IUserModel> {
        return await queryBuilder(this.modelConstructor).findOrFail(id)
    }

    /**
     * Find a user by their email
     * 
     * @param email - The email of the user to find
     * @returns The user record or null if not found
     */
    async findByEmail(email: string): Promise<IUserModel | null> {
        return await queryBuilder(this.modelConstructor).where('email', email).first()
    }

}

export default UserRepository;


