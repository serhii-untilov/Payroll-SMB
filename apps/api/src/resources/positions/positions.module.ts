import { CompaniesModule } from './../companies/companies.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Position } from './entities/position.entity';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Position]), UsersModule, CompaniesModule],
    controllers: [PositionsController],
    providers: [PositionsService],
})
export class PositionsModule {}
