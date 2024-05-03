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
    constructor(private readonly paymentTypesService: PaymentTypesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createPaymentTypeDto: CreatePaymentTypeDto) {
        const userId = req.user['sub'];
        return await this.paymentTypesService.create(userId, createPaymentTypeDto);
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
        return await this.paymentTypesService.findAll({
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
        return await this.paymentTypesService.findOne({
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
        return await this.paymentTypesService.update(userId, id, updatePaymentTypeDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.paymentTypesService.remove(userId, id);
    }
}
