import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { FindTaskDto } from './dto/find-task.dto';
import { Task } from './entities/task.entity';
import { getUserId } from 'src/utils/getUserId';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreateTaskDto): Promise<Task> {
        const userId = getUserId(req);
        await this.tasksService.availableCreateOrFail(userId, payload.companyId);
        return await this.tasksService.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() payload: FindTaskDto): Promise<Task[]> {
        const userId = getUserId(req);
        payload.companyId &&
            (await this.tasksService.availableFindAllOrFail(userId, payload.companyId));
        return await this.tasksService.findAll(deepStringToShortDate(payload));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<Task> {
        const userId = getUserId(req);
        const found = await this.tasksService.findOne(id, !!relations);
        await this.tasksService.availableFindAllOrFail(userId, found.companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
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
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Task> {
        const userId = getUserId(req);
        await this.tasksService.availableDeleteOrFail(userId, id);
        return await this.tasksService.remove(userId, id);
    }
}
