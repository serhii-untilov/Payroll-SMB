import { Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    constructor() {
        super();
        const logger = new Logger(RefreshTokenGuard.name);
        logger.log('constructor');
    }
}
