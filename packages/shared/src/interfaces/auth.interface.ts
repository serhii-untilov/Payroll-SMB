export interface IAuth {
    name: string;
    password: string;
}

export class ITokens {
    accessToken: string;
    refreshToken: string;
}
