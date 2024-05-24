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
import { CreatePayFundTypeDto } from './dto/create-pay-fund-type.dto';
import { UpdatePayFundTypeDto } from './dto/update-pay-fund-type.dto';
import { FundTypesService } from './pay-fund-types.service';

@Controller('fund-types')
export class FundTypesController {
    constructor(private readonly service: FundTypesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createFundTypeDto: CreatePayFundTypeDto) {
        const userId = req.user['sub'];
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, createFundTypeDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request) {
        const userId = req.user['sub'];
        await this.service.availableFindAllOrFail(userId);
        return await this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        await this.service.availableFindOneOrFail(userId);
        return await this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFundTypeDto: UpdatePayFundTypeDto,
    ) {
        const userId = req.user['sub'];
        await this.service.availableUpdateOrFail(userId);
        return await this.service.update(userId, id, updateFundTypeDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        await this.service.availableUpdateOrFail(userId);
        return await this.service.remove(userId, id);
    }
}
