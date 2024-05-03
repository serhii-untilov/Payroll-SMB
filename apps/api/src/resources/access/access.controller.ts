import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { IAccess } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { AccessService } from './access.service';
import {
    AvailableAccessDto,
    AvailableAccessUserCompanyDto,
    AvailableAccessUserDto,
} from './dto/available-access.dto';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('access')
export class AccessController {
    constructor(private readonly accessService: AccessService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createAccessDto: CreateAccessDto): Promise<IAccess> {
        const userId = req.user['sub'];
        return await this.accessService.create(userId, createAccessDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Param('roleType') roleType: string,
        @Param('resourceType') resourceType: string,
    ): Promise<IAccess[]> {
        return await this.accessService.findAll(roleType, resourceType);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IAccess> {
        return await this.accessService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAccessDto: UpdateAccessDto,
    ): Promise<IAccess> {
        const userId = req.user['sub'];
        return await this.accessService.update(userId, id, updateAccessDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IAccess> {
        const userId = req.user['sub'];
        return await this.accessService.remove(userId, id);
    }

    @Post('available')
    async available(@Body() payload: AvailableAccessDto): Promise<boolean> {
        return await this.accessService.available(payload);
    }

    @Post('available-user')
    async availableForUser(@Body() payload: AvailableAccessUserDto) {
        return await this.accessService.availableForUser(payload);
    }

    @Post('available-user-company')
    async availableForUserCompany(@Body() payload: AvailableAccessUserCompanyDto) {
        return await this.accessService.availableForUserCompany(payload);
    }
}
