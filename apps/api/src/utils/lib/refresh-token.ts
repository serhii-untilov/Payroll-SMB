import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export function getRefreshToken(req: Request): string {
    const refreshToken = req.user ? req.user['refreshToken'] : null;
    if (!refreshToken) {
        throw new BadRequestException('Refresh token not defined.');
    }
    return refreshToken;
}
