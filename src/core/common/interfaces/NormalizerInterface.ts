/* eslint-disable no-unused-vars */
export interface NormalizerInterface {
    normalize(...args: any[]): unknown;
    denormalize(...args: any[]): unknown;
}