import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { PersonEntity } from './entities/person.entity';
import { PersonController } from './person.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PersonEntity]), forwardRef(() => AccessModule)],
    controllers: [PersonController],
})
export class PersonModule {}
