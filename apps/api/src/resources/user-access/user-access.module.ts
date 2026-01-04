import { forwardRef, Module } from '@nestjs/common';
import { UserAccessService } from './user-access.service';
import { UserAccessController } from './user-access.controller';
import { UsersModule } from '../users';
import { UserRoleModule } from '../user-role';

@Module({
    imports: [forwardRef(() => UsersModule), forwardRef(() => UserRoleModule)],
    controllers: [UserAccessController],
    providers: [UserAccessService],
})
export class UserAccessModule {}
