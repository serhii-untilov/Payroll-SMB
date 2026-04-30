import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinWage } from './entities/min-wage.entity';
import { MinWageController } from './min-wage.controller';
import { MinWageService } from './min-wage.service';

@Module({
    imports: [TypeOrmModule.forFeature([MinWage])],
    controllers: [MinWageController],
    providers: [MinWageService],
    exports: [MinWageService],
})
export class MinWageModule {}
