import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards';
import { getUserId } from '../../utils';
import { AccessService } from './access.service';
import {
    AvailableAccessDto,
    AvailableAccessUserCompanyDto,
    AvailableAccessUserDto,
    CreateAccessDto,
    UpdateAccessDto,
} from './dto';
import { Access } from './entities/access.entity';

@Controller('access')
@ApiBearerAuth()
export class AccessController {
    constructor(private readonly accessService: AccessService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create an access record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: Access,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreateAccessDto): Promise<Access> {
        const userId = getUserId(req);
        return await this.accessService.create(userId, payload);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Access) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(
        @Param('roleType') roleType: string,
        @Param('resource') resource: string,
    ): Promise<Access[]> {
        return await this.accessService.findAll(roleType, resource);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: Access })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Param('id', ParseIntPipe) id: string): Promise<Access> {
        return await this.accessService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update an access record' })
    @ApiOkResponse({ description: 'The updated record', type: Access })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() payload: UpdateAccessDto,
    ): Promise<Access> {
        const userId = getUserId(req);
        return await this.accessService.update(userId, id, payload);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete an access record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Access })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<Access> {
        const userId = getUserId(req);
        return await this.accessService.remove(userId, id);
    }

    @Post('available')
    @ApiOperation({ summary: 'Check access' })
    @ApiOkResponse({ description: 'Is access enabled' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async available(@Body() payload: AvailableAccessDto): Promise<boolean> {
        return await this.accessService.available(payload);
    }

    @Post('available-user')
    @ApiOperation({ summary: 'Check access for user' })
    @ApiOkResponse({ description: 'Is access enabled' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async availableForUser(@Body() payload: AvailableAccessUserDto) {
        return await this.accessService.availableForUser(payload);
    }

    @Post('available-user-company')
    @ApiOperation({ summary: 'Check access for user in a company' })
    @ApiOkResponse({ description: 'Is access enabled' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async availableForUserCompany(@Body() payload: AvailableAccessUserCompanyDto) {
        return await this.accessService.availableForUserCompany(payload);
    }
}
