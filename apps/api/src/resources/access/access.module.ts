import { Module } from '@nestjs/common';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Access } from './entities/access.entity';
import { UsersService } from '../users/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([Access]), UsersService],
    controllers: [AccessController],
    providers: [AccessService],
})
export class AccessModule {}
