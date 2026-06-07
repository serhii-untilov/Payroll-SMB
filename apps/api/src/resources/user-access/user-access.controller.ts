import { Body, Controller, Post } from '@nestjs/common';
import { IUserAccessService } from '../common/base/user-access.interface';
import { AccessCheckDto } from './dto/access-check.dto';

@Controller('user-access')
export class UserAccessController {
    constructor(private readonly userAccessService: IUserAccessService) {}

    @Post('can-user')
    canUser(@Body() dto: AccessCheckDto): Promise<boolean> {
        return this.userAccessService.isAllowed(dto);
    }
}
