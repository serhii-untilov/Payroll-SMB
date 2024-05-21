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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PayrollCalculationService } from '../../processor/payrollCalculation/payrollCalculation.service';

@Controller('companies')
export class CompaniesController {
    constructor(
        private readonly companiesService: CompaniesService,
        private readonly salaryCalculateService: PayrollCalculationService,
    ) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createCompanyDto: CreateCompanyDto) {
        const userId = req.user['sub'];
        const company = await this.companiesService.create(userId, createCompanyDto);
        return company;
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Query() relations: boolean) {
        const userId = req.user['sub'];
        return await this.companiesService.findAll(userId, relations);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query() relations: boolean,
    ) {
        const userId = req.user['sub'];
        return await this.companiesService.findOne(userId, id, relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCompanyDto: UpdateCompanyDto,
    ) {
        const userId = req.user['sub'];
        return await this.companiesService.update(userId, id, updateCompanyDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.companiesService.remove(userId, id);
    }

    @Get(':id/salary-calculate')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async salaryCalculate(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.salaryCalculateService.calculateCompany(userId, id);
    }
}
