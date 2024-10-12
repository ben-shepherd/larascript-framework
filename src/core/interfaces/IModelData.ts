/**
 * Interface for model data.
 *
 * @property {string} [id] - The ID of the model.
 * @property {Date} [createdAt] - The date and time the model was created.
 * @property {Date} [updatedAt] - The date and time the model was updated.
 * @property {any} [key] - Any other property that is not explicitly defined.
 */
export default interface IModelData {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: unknown;
}
