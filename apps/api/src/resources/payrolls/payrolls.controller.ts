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
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { PayrollsService } from './payrolls.service';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { Request } from 'express';
import { objectStringDateToShort } from '@repo/shared';
import { FindPayrollDto } from './dto/find-payroll.dto';

@Controller('payroll')
export class PayrollsController {
    constructor(private readonly payrollsService: PayrollsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePayrollDto) {
        const userId = req.user['sub'];
        return await this.payrollsService.create(userId, objectStringDateToShort(payload));
    }

    @Post('find-all')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() params: FindPayrollDto) {
        const userId = req.user['sub'];
        return await this.payrollsService.findAll(userId, objectStringDateToShort(params));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ) {
        const userId = req.user['sub'];
        return await this.payrollsService.findOne(userId, id, relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePayrollDto: UpdatePayrollDto,
    ) {
        const userId = req.user['sub'];
        return await this.payrollsService.update(userId, id, updatePayrollDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.payrollsService.remove(userId, id);
    }
}
