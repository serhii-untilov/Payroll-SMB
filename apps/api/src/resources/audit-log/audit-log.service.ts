import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogService {
    findAll() {
        return `This action returns all auditLog`;
    }

    findOne(id: number) {
        return `This action returns a #${id} auditLog`;
    }
}
