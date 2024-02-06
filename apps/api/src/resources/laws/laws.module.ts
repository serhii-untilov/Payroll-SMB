import { Module } from '@nestjs/common';
import { LawsService } from './laws.service';
import { LawsController } from './laws.controller';

@Module({
    controllers: [LawsController],
    providers: [LawsService],
})
export class LawsModule {}
