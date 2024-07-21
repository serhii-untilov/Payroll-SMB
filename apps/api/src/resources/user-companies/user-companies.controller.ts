import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FindAllUserCompanyDto, FindOneUserCompanyDto } from './dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UserCompany } from './entities/user-company.entity';
import { UserCompaniesService } from './user-companies.service';

@Controller('user-companies')
export class UserCompaniesController {
    constructor(private readonly service: UserCompaniesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiCreatedResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(UserCompany) } },
    })
    async create(@Req() req: Request, payload: CreateUserCompanyDto): Promise<UserCompany> {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, payload);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(UserCompany) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(
        @Req() req: Request,
        @Body() params: FindAllUserCompanyDto,
    ): Promise<UserCompany[]> {
        const userId = getUserId(req);
        this.service.availableFindAllOrFail(userId);
        return await this.service.findAll(params);
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() params: FindOneUserCompanyDto,
    ): Promise<UserCompany> {
        const userId = getUserId(req);
        this.service.availableFindAllOrFail(userId);
        return await this.service.findOne(id, params);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a User Company record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: UserCompany })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<UserCompany> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId);
        return await this.service.remove(userId, id);
    }

    @Post(':id/restore')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Restore a User Company record' })
    @ApiOkResponse({ description: 'The record has been successfully restored', type: UserCompany })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserCompany> {
        const userId = getUserId(req);
        return await this.service.restore(userId, id);
    }
}
