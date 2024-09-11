/* eslint-disable no-unused-vars */
import { IDatabaseDocument } from "@src/core/domains/database/interfaces/IDocumentManager";

/**
 * Provides methods for validating documents in the database.
 */
export interface IDocumentValidator
{

    /**
     * Configures whether invalid documents should throw exceptions or not.
     * If set to false, invalid documents will return false from the validation methods.
     * @param value - Whether to throw exceptions or not.
     */
    surpressInvalidDocumentExceptions(value: boolean): void;

    /**
     * Validates a single document.
     * @param document - The document to validate.
     * @returns Whether the document is valid or not.
     */
    validateSingleDocument(document: unknown): boolean;

    /**
     * Validates multiple documents.
     * @param documents - The documents to validate.
     * @returns Whether all documents are valid or not.
     */
    validateMultipleDocuments(documents: unknown): boolean;

    /**
     * Checks if the document is findable.
     * @param documentOrDocuments - The document or documents to check.
     * @returns Whether the document(s) are findable or not.
     */
    validateContainsId(documentOrDocuments: IDatabaseDocument | IDatabaseDocument[]): boolean;

    /**
     * Checks if the document are without an id.
     * @param documentOrDocuments - The document or documents to check.
     * @returns Whether the document(s) are without an id or not.
     */
    validateWithoutId(documentOrDocuments: IDatabaseDocument | IDatabaseDocument[]): boolean;
}
