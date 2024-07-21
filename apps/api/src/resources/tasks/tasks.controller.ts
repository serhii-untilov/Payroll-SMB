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
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindAllTaskDto } from './dto/find-all-task.dto';
import { FindOneTaskDto } from './dto/find-one-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@ApiBearerAuth()
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create task' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: Task,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreateTaskDto): Promise<Task> {
        const userId = getUserId(req);
        await this.tasksService.availableCreateOrFail(userId, payload.companyId);
        return await this.tasksService.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Task) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() payload: FindAllTaskDto): Promise<Task[]> {
        const userId = getUserId(req);
        payload.companyId &&
            (await this.tasksService.availableFindAllOrFail(userId, payload.companyId));
        return await this.tasksService.findAll(deepStringToShortDate(payload));
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: Task })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() params?: FindOneTaskDto,
    ) {
        const userId = getUserId(req);
        const found = await this.tasksService.findOne(id, params);
        await this.tasksService.availableFindAllOrFail(userId, found.companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a task' })
    @ApiOkResponse({ description: 'The updated record', type: Task })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateTaskDto,
    ): Promise<Task> {
        const userId = getUserId(req);
        await this.tasksService.availableUpdateOrFail(userId, id);
        return await this.tasksService.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a task' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Task })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Task> {
        const userId = getUserId(req);
        await this.tasksService.availableDeleteOrFail(userId, id);
        return await this.tasksService.remove(userId, id);
    }
}
