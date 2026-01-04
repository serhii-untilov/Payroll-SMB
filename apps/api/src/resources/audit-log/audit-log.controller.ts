import { Controller, Get, Param } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit-log')
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) {}

    @Get()
    findAll() {
        return this.auditLogService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.auditLogService.findOne(+id);
    }
}
