import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Person } from './entities/person.entity';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

@Module({
    imports: [TypeOrmModule.forFeature([Person]), UsersModule],
    controllers: [PersonsController],
    providers: [PersonsService],
})
export class PersonsModule {}
