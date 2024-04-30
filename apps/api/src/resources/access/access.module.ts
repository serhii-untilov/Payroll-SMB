import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { Access } from './entities/access.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Access]), UsersModule],
    controllers: [AccessController],
    providers: [AccessService],
    exports: [AccessService],
})
export class AccessModule {}
