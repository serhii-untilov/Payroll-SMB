import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
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
import { CreateWorkTimeNormDto } from './dto/create-work-time-norm.dto';
import { FindWorkTimeNormDto } from './dto/find-work-time-norm.dto';
import { UpdateWorkTimeNormDto } from './dto/update-work-time-norm.dto';
import { WorkTimeNorm } from './entities/work-time-norm.entity';
import { WorkTimeNormService } from './work-time-norm.service';

@Controller('work-time-norm')
@ApiBearerAuth()
export class WorkTimeNormController {
    constructor(private readonly service: WorkTimeNormService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create Work Norm record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: WorkTimeNorm,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreateWorkTimeNormDto) {
        const userId = getUserId(req);
        return await this.service.create(userId, deepTransformToShortDate(payload));
    }

    @Post('list')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(WorkTimeNorm) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Body() params: FindWorkTimeNormDto) {
        return await this.service.findAll(params);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: WorkTimeNorm })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string, @Body() params: FindWorkTimeNormDto) {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id, params);
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Work Norm record' })
    @ApiOkResponse({ description: 'The updated record', type: WorkTimeNorm })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() payload: UpdateWorkTimeNormDto,
    ) {
        const userId = getUserId(req);
        return await this.service.update(userId, id, version, deepTransformToShortDate(payload));
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Work Norm record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: WorkTimeNorm })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        return await this.service.remove(userId, id, version);
    }
}
