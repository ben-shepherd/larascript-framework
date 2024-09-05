import { IDatabaseDocument } from "./IDocumentManager";

export interface IDocumentValidator
{
    surpressInvalidDocumentExceptions(value: boolean): void;
    validateSingleDocument(document: unknown): boolean;
    validateMultipleDocuments(documents: unknown): boolean;
    validateContainsId(documentOrDocuments: IDatabaseDocument | IDatabaseDocument[]): boolean;
    validateWithoutId(documentOrDocuments: IDatabaseDocument | IDatabaseDocument[]): boolean;
}