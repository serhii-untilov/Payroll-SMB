import { MinWage } from './entities/min-wage.entity';
import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    getSchemaPath,
} from '@nestjs/swagger';
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreateMinWageDto } from './dto/create-min-wage.dto';
import { UpdateMinWageDto } from './dto/update-min-wage.dto';
import { MinWageService } from './min-wage.service';

@Controller('min-wage')
@ApiBearerAuth()
export class MinWageController {
    constructor(private readonly service: MinWageService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a Min Wage record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: MinWage,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreateMinWageDto): Promise<string> {
        const userId = getUserId(req);
        return await this.service.create(userId, deepTransformToShortDate(payload));
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(MinWage) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(): Promise<MinWage[]> {
        return this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: MinWage })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string): Promise<MinWage> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Min Wage record' })
    @ApiOkResponse({ description: 'The updated record', type: MinWage })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() payload: UpdateMinWageDto,
    ): Promise<void> {
        const userId = getUserId(req);
        return await this.service.update(userId, id, version, deepTransformToShortDate(payload));
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Min Wage record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: MinWage })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
    ): Promise<void> {
        const userId = getUserId(req);
        return await this.service.remove(userId, id, version);
    }
}
