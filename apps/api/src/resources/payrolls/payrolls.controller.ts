import {
    BadRequestException,
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
import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { Request } from 'express';
import { deepStringToShortDate } from '@repo/shared';
import { FindPayrollDto } from './dto/find-payroll.dto';
import { Payroll } from './entities/payroll.entity';
import { getUserId } from '@/utils/getUserId';

@Controller('payroll')
export class PayrollsController {
    constructor(private readonly service: PayrollsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePayrollDto): Promise<Payroll> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(payload.positionId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<Payroll> {
        const userId = getUserId(req);
        await this.service.availableFindOneOrFail(userId, id);
        return await this.service.findOne(id, relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePayrollDto,
    ): Promise<Payroll> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Payroll> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('find-all')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() params: FindPayrollDto): Promise<Payroll[]> {
        const userId = getUserId(req);
        if (params.companyId) {
            await this.service.availableFindAllOrFail(userId, params.companyId);
        } else if (params.positionId) {
            const companyId = await this.service.getPositionCompanyId(params.positionId);
            await this.service.availableFindAllOrFail(userId, companyId);
        } else {
            throw new BadRequestException('Company or Position required.');
        }
        return await this.service.findAll(deepStringToShortDate(params));
    }
}
