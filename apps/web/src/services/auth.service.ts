import { api } from '@/api';
import {
    AuthDto,
    CreateUserDto,
    FindOneUserDto,
    PublicUserDataDto,
    TokensDto,
} from '@repo/openapi';
import { removeUserTokens, saveUserTokens } from './token.service';

export async function authRegister(params: CreateUserDto): Promise<TokensDto> {
    const response = await api.authRegister(params);
    const tokens = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function authLogin(params: AuthDto): Promise<TokensDto> {
    const response = await api.authLogin(params);
    const tokens: TokensDto = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function authLogout(): Promise<void> {
    removeUserTokens();
    try {
        await api.authLogout();
    } catch (e) {
        console.log(e);
    }
}

export async function usersFindCurrent(params?: FindOneUserDto): Promise<PublicUserDataDto> {
    const response = await api.usersFindCurrent(params ?? {});
    return response.data;
}

export async function demo(): Promise<AuthDto> {
    const response = await api.authDemo();
    return response.data;
}
