import { BadRequestException } from '@nestjs/common';

export function checkVersionOrFail(record: { version: number }, payload: { version: number }): void {
    if (record.version !== payload.version) {
        throw new BadRequestException('Record was modified by another user');
    }
}
