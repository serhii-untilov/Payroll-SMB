import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkNormPeriod } from './entities/work-norm-period.entity';
import { WorkNorm } from './entities/work-norm.entity';
import { WorkNormsController } from './work-norms.controller';
import { WorkNormsService } from './work-norms.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkNorm, WorkNormPeriod])],
    controllers: [WorkNormsController],
    providers: [WorkNormsService],
    exports: [WorkNormsService],
})
export class WorkNormsModule {}
