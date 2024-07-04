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
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreateWorkNormDto } from './dto/create-work-norm.dto';
import { UpdateWorkNormDto } from './dto/update-work-norm.dto';
import { WorkNormsService } from './work-norms.service';
import { deepStringToShortDate } from '@repo/shared';
import { getUserId } from 'src/utils/getUserId';

@Controller('work-norms')
export class WorkNormsController {
    constructor(private readonly service: WorkNormsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreateWorkNormDto) {
        const userId = getUserId(req);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean) {
        return await this.service.findAll(!!relations);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ) {
        return await this.service.findOne(id, !!relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateWorkNormDto,
    ) {
        const userId = getUserId(req);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = getUserId(req);
        return await this.service.remove(userId, id);
    }
}
