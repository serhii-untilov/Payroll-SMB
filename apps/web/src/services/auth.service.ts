import { api } from '@/api';
import { AuthDto, CreateUserDto, FindOneUserDto } from '@repo/openapi';
import { removeUserTokens, saveUserTokens } from './token.service';

export async function authRegister(params: CreateUserDto) {
    const tokens = (await api.authRegister(params)).data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function authLogin(params: AuthDto) {
    const tokens = (await api.authLogin(params)).data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function authLogout() {
    removeUserTokens();
    try {
        await api.authLogout();
    } catch (e) {
        console.log(e);
    }
}

export async function usersFindCurrent(params?: FindOneUserDto) {
    return (await api.usersFindCurrent(params ?? {})).data;
}

export async function demo() {
    return (await api.authDemo()).data;
}
