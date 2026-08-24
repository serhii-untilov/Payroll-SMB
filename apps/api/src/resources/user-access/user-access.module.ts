import { forwardRef, Module } from '@nestjs/common';
import { UserAccessService } from './user-access.service';
import { UserAccessController } from './user-access.controller';
import { UserRoleModule } from '../user-role/user-role.module';
import { IUserAccessService } from '../common/base/user-access.interface';

@Module({
    imports: [forwardRef(() => UserRoleModule)],
    controllers: [UserAccessController],
    providers: [
        UserAccessService,
        { provide: IUserAccessService, useExisting: UserAccessService },
    ],
    exports: [UserAccessService, IUserAccessService],
})
export class UserAccessModule {}
