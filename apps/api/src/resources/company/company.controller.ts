import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
    forwardRef,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CompanyService } from './company.service';
import { CompanyReadDto } from './dto/company-read.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { ListCompaniesDto } from './dto/list-companies.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';

@Controller('companies')
@ApiBearerAuth()
export class CompanyController {
    constructor(@Inject(forwardRef(() => CompanyService)) private readonly service: CompanyService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create company' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: CompanyEntity,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() dto: CreateCompanyDto): Promise<string> {
        const userId = getUserId(req);
        return await this.service.create(userId, deepTransformToShortDate(dto));
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a company' })
    @ApiOkResponse({ description: 'The updated record', type: CompanyEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() payload: UpdateCompanyDto,
    ): Promise<void> {
        const userId = getUserId(req);
        await this.service.update(userId, id, version, deepTransformToShortDate(payload));
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a company' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: CompanyEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
    ): Promise<void> {
        const userId = getUserId(req);
        await this.service.remove(userId, id, version);
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        type: ListCompaniesDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() query: ListCompaniesQueryDto): Promise<ListCompaniesDto> {
        const userId = getUserId(req);
        return this.service.findAll(userId, query);
    }

    @Get('last')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: CompanyEntity })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findLast(@Req() req: Request): Promise<CompanyReadDto | undefined> {
        const userId = getUserId(req);
        return await this.service.findLast(userId);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: CompanyEntity })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<CompanyReadDto> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }

    @Get(':id/calculate-payroll')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Calculate salary for a company' })
    @ApiOkResponse({ description: 'Salary has been successfully calculated' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async salaryCalculate(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<void> {
        const userId = getUserId(req);
        await this.service.calculatePayroll(userId, id);
    }
}
