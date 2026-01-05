import { forwardRef, Module } from '@nestjs/common';
import { UserAccessService } from './user-access.service';
import { UserAccessController } from './user-access.controller';
import { UserRoleModule } from '../user-role';

@Module({
    imports: [forwardRef(() => UserAccessModule), forwardRef(() => UserRoleModule)],
    controllers: [UserAccessController],
    providers: [UserAccessService],
})
export class UserAccessModule {}
