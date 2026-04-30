import { MinWage } from './entities/min-wage.entity';
import { AccessTokenGuard } from '@/guards';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
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
    async create(@Body() payload: CreateMinWageDto): Promise<MinWage> {
        return await this.service.create('', deepTransformToShortDate(payload));
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
    async findOne(@Param('id', ParseIntPipe) id: string): Promise<MinWage> {
        return await this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Min Wage record' })
    @ApiOkResponse({ description: 'The updated record', type: MinWage })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Param('id', ParseIntPipe) id: string,
        @Body() payload: UpdateMinWageDto,
    ): Promise<MinWage> {
        return await this.service.update('', id, deepTransformToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Min Wage record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: MinWage })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Param('id', ParseIntPipe) id: string): Promise<MinWage> {
        return await this.service.remove('', id);
    }
}
