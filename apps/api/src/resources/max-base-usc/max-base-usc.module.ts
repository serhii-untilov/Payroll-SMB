import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { MaxBaseUSC } from './entities/max-base-usc.entity';
import { MaxBaseUscController } from './max-base-usc.controller';
import { MaxBaseUscService } from './max-base-usc.service';

@Module({
    imports: [TypeOrmModule.forFeature([MaxBaseUSC]), AccessModule],
    controllers: [MaxBaseUscController],
    providers: [MaxBaseUscService],
    exports: [MaxBaseUscService],
})
export class MaxBaseUscModule {}
