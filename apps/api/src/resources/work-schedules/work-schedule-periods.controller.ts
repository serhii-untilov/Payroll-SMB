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
import { UsersService } from '../users/users.service';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';
import { CreateWorkSchedulePeriodDto } from './dto/create-work-schedule-period.dto';
import { UpdateWorkSchedulePeriodDto } from './dto/update-work-schedule-period.dto';

@Controller('work-schedule-periods')
export class WorkSchedulePeriodsController {
    constructor(
        private readonly workSchedulePeriodsService: WorkSchedulePeriodsService,
        private readonly usersService: UsersService,
    ) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Req() req: Request,
        @Body() createWorkSchedulePeriodDto: CreateWorkSchedulePeriodDto,
    ) {
        const user = await this.usersService.findOneBy({ id: req.user['sub'] });
        return await this.workSchedulePeriodsService.create(user, createWorkSchedulePeriodDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.workSchedulePeriodsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.workSchedulePeriodsService.findOne({
            where: { id },
            relations: { law: true, accounting: true, owner: true },
        });
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkSchedulePeriodDto: UpdateWorkSchedulePeriodDto,
    ) {
        const user = await this.usersService.findOneBy({ id: req.user['sub'] });
        return await this.workSchedulePeriodsService.update(user, id, updateWorkSchedulePeriodDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const user = await this.usersService.findOneBy({ id: req.user['sub'] });
        return await this.workSchedulePeriodsService.remove(user, id);
    }
}
