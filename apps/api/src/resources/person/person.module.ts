import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { PersonEntity } from './entities/person.entity';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PersonMapper } from './mappers/person.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([PersonEntity]), forwardRef(() => UserAccessModule)],
    controllers: [PersonController],
    providers: [PersonService, PersonMapper],
    exports: [PersonService],
})
export class PersonModule {}
