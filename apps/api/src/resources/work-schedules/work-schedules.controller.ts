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
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { WorkSchedulesService } from './work-schedules.service';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';

@Controller('work-schedules')
export class WorkSchedulesController {
    constructor(private readonly workSchedulesService: WorkSchedulesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createWorkScheduleDto: CreateWorkScheduleDto) {
        const userId = req.user['sub'];
        return await this.workSchedulesService.create(userId, createWorkScheduleDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.workSchedulesService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.workSchedulesService.findOne({
            where: { id },
            relations: {
                law: true,
                accounting: true,
                // , owner: true
            },
        });
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkScheduleDto: UpdateWorkScheduleDto,
    ) {
        const userId = req.user['sub'];
        return await this.workSchedulesService.update(userId, id, updateWorkScheduleDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.workSchedulesService.remove(userId, id);
    }
}
