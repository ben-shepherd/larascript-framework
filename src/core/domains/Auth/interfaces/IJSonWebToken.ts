export interface IJSonWebToken {
    uid: string;
    token: string;
    iat?: number;
    exp?: number;
}