import { Module } from '@nestjs/common';
import { LawsService } from './laws.service';
import { LawsController } from './laws.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Law } from './entities/law.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Law])],
    controllers: [LawsController],
    providers: [LawsService],
})
export class LawsModule {}
