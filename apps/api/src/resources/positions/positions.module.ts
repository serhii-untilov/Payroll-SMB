import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { PayPeriodsModule } from '../pay-periods/pay-periods.module';
import { Position } from './entities/position.entity';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PositionBalance } from './entities/position-balance.entity';
import { PayrollsModule } from '../payrolls/payrolls.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Position, PositionBalance]),
        forwardRef(() => AccessModule),
        forwardRef(() => PayPeriodsModule),
        forwardRef(() => PayrollsModule),
    ],
    controllers: [PositionsController],
    providers: [PositionsService],
    exports: [PositionsService],
})
export class PositionsModule {}
