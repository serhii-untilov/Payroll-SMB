import { Body, Controller, Post } from '@nestjs/common';
import { CanUserDto } from './dto/can-user.dto';
import { UserAccessService } from './user-access.service';

@Controller('user-access')
export class UserAccessController {
    constructor(private readonly userAccessService: UserAccessService) {}

    @Post('can-user')
    canUser(@Body() dto: CanUserDto): Promise<boolean> {
        return this.userAccessService.canUser(dto);
    }
}
