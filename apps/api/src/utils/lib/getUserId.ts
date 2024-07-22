import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export function getUserId(req: Request): number {
    const userId = req.user ? req.user['id'] : null;
    if (!userId) {
        throw new BadRequestException(`User not defined.`);
    }
    return Number(userId);
}
