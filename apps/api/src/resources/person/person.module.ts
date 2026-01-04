import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { PersonEntity } from './entities/person.entity';
import { PersonController } from './person.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PersonEntity]), forwardRef(() => UserAccessModule)],
    controllers: [PersonController],
})
export class PersonModule {}
