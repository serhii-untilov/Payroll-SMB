import { Module } from '@nestjs/common';
import { MinWageService } from './min-wage.service';
import { MinWageController } from './min-wage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinWage } from './entities/min-wage.entity';
import { AccessModule } from '../access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([MinWage]), AccessModule],
    controllers: [MinWageController],
    providers: [MinWageService],
    exports: [MinWageService],
})
export class MinWageModule {}
