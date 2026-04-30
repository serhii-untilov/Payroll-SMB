import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditLogListenerService } from './audit-log-listener.service';
import { AuditLogEntity } from './entities/audit-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AuditLogEntity])],
    controllers: [AuditLogController],
    providers: [AuditLogService, AuditLogListenerService],
})
export class AuditLogModule {}
