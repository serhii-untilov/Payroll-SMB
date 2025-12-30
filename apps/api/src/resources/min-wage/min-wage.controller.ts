import { MinWage } from './entities/min-wage.entity';
import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
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
import { deepStringToShortDate } from '@repo/shared';
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
    async create(@Req() req: Request, @Body() payload: CreateMinWageDto): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(MinWage) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request): Promise<MinWage[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId);
        return this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: MinWage })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableFindOneOrFail(userId);
        return await this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Min Wage record' })
    @ApiOkResponse({ description: 'The updated record', type: MinWage })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() payload: UpdateMinWageDto,
    ): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Min Wage record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: MinWage })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId);
        return await this.service.remove(userId, id);
    }
}
