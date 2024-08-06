import { ConflictException } from '@nestjs/common';

type Versioned = { version?: number };

export function checkVersionOrFail(obj1: Versioned, obj2: Versioned) {
    if (obj1.version !== obj2.version) {
        throw new ConflictException(
            'The record has been updated by another user. Try to edit it after reloading.',
        );
    }
}
