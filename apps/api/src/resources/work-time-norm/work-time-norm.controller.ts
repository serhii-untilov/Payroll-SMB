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

@Controller('work-time-norms')
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
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, deepTransformToShortDate(payload));
    }

    @Post('find')
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

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: WorkTimeNorm })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Param('id', ParseIntPipe) id: string, @Body() params: FindWorkTimeNormDto) {
        return await this.service.findOne(id, params);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Work Norm record' })
    @ApiOkResponse({ description: 'The updated record', type: WorkTimeNorm })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(@Req() req: Request, @Param('id', ParseIntPipe) id: string, @Body() payload: UpdateWorkTimeNormDto) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId);
        return await this.service.update(userId, id, deepTransformToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Work Norm record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: WorkTimeNorm })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string) {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId);
        return await this.service.remove(userId, id);
    }
}
