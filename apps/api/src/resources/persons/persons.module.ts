import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { Person } from './entities/person.entity';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

@Module({
    imports: [TypeOrmModule.forFeature([Person]), forwardRef(() => AccessModule)],
    controllers: [PersonsController],
    providers: [PersonsService],
    exports: [PersonsService],
})
export class PersonsModule {}
