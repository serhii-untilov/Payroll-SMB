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
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
    constructor(private readonly service: JobsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreateJobDto) {
        const userId = req.user['sub'];
        return await this.service.create(userId, payload);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateJobDto,
    ) {
        const userId = req.user['sub'];
        return await this.service.update(userId, id, payload);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.service.remove(userId, id);
    }
}
