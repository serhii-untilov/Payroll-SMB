import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { Person } from './entities/person.entity';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

@Module({
    imports: [TypeOrmModule.forFeature([Person]), AccessModule],
    controllers: [PersonsController],
    providers: [PersonsService],
})
export class PersonsModule {}
