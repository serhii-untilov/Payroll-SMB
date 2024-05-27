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
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentTypesService } from './payment-types.service';

@Controller('payment-types')
export class PaymentTypesController {
    constructor(private readonly service: PaymentTypesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePaymentTypeDto) {
        const userId = req.user['sub'];
        return await this.service.create(userId, payload);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query('part') part: string,
        @Query('groups') groups: string,
        @Query('methods') methods: string,
        @Query('ids') ids: string,
    ) {
        return await this.service.findAll({
            part,
            groups: groups ? JSON.parse(decodeURIComponent(groups)) : null,
            methods: methods ? JSON.parse(decodeURIComponent(methods)) : null,
            ids: ids ? JSON.parse(decodeURIComponent(ids)) : null,
        });
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.service.findOne({
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
        @Body() updatePaymentTypeDto: UpdatePaymentTypeDto,
    ) {
        const userId = req.user['sub'];
        return await this.service.update(userId, id, updatePaymentTypeDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.service.remove(userId, id);
    }
}
