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
import { Payroll } from './entities/payroll.entity';

@Controller('payroll')
export class PayrollsController {
    constructor(private readonly payrollsService: PayrollsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePayrollDto): Promise<Payroll> {
        const userId = req.user['sub'];
        return await this.payrollsService.create(userId, objectStringDateToShort(payload));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<Payroll> {
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
    ): Promise<Payroll> {
        const userId = req.user['sub'];
        return await this.payrollsService.update(userId, id, updatePayrollDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Payroll> {
        const userId = req.user['sub'];
        return await this.payrollsService.remove(userId, id);
    }

    @Post('find-all')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() params: FindPayrollDto): Promise<Payroll[]> {
        const userId = req.user['sub'];
        return await this.payrollsService.findAll(userId, objectStringDateToShort(params));
    }
}
