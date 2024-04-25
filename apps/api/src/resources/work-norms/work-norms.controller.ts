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
import { WorkNormsService } from './work-norms.service';
import { CreateWorkNormDto } from './dto/create-work-norm.dto';
import { UpdateWorkNormDto } from './dto/update-work-norm.dto';

@Controller('work-norms')
export class WorkNormsController {
    constructor(private readonly workNormsService: WorkNormsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createWorkNormDto: CreateWorkNormDto) {
        const userId = req.user['sub'];
        return await this.workNormsService.create(userId, createWorkNormDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.workNormsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.workNormsService.findOne({
            where: { id },
            relations: {
                law: true,
                accounting: true,
            },
        });
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkNormDto: UpdateWorkNormDto,
    ) {
        const userId = req.user['sub'];
        return await this.workNormsService.update(userId, id, updateWorkNormDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.workNormsService.remove(userId, id);
    }
}
