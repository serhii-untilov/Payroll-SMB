import { Body, Controller, Post } from '@nestjs/common';
import { AccessCheckDto } from './dto/access-check.dto';
import { UserAccessService } from './user-access.service';

@Controller('user-access')
export class UserAccessController {
    constructor(private readonly userAccessService: UserAccessService) {}

    @Post('can-user')
    canUser(@Body() dto: AccessCheckDto): Promise<boolean> {
        return this.userAccessService.isAllowed(dto);
    }
}
