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
} from '@nestjs/swagger';
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobReadDto } from './dto/job-read.dto';
import { ListJobsQueryDto } from './dto/list-jobs-query.dto';
import { ListJobsDto } from './dto/list-jobs.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobEntity } from './entities/job.entity';

@Controller('jobs')
@ApiBearerAuth()
export class JobController {
    constructor(private readonly service: JobService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create job' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: JobEntity,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() dto: CreateJobDto): Promise<string> {
        const userId = getUserId(req);
        return await this.service.create(userId, deepTransformToShortDate(dto));
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a job' })
    @ApiOkResponse({ description: 'The updated record', type: JobEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() dto: UpdateJobDto,
    ) {
        const userId = getUserId(req);
        await this.service.update(userId, id, version, deepTransformToShortDate(dto));
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a job' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: JobEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.remove(userId, id, version);
    }

    @Post(':id/restore/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a job' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: JobEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.restore(userId, id, version);
    }

    @Post('list')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        type: ListJobsDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() query: ListJobsQueryDto): Promise<ListJobsDto> {
        const userId = getUserId(req);
        return this.service.findAll(userId, query);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: JobEntity })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string): Promise<JobReadDto> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }
}
