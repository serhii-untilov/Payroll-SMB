import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Law } from './entities/law.entity';
import { LawsController } from './laws.controller';
import { LawsService } from './laws.service';

@Module({
    imports: [TypeOrmModule.forFeature([Law])],
    controllers: [LawsController],
    providers: [LawsService],
})
export class LawsModule {}
