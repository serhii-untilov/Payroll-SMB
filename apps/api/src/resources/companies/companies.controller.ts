import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    forwardRef,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { deepStringToShortDate } from '@repo/shared';
import { getUserId } from '@/utils/getUserId';

@Controller('companies')
export class CompaniesController {
    private _logger: Logger = new Logger(CompaniesService.name);

    constructor(
        @Inject(forwardRef(() => CompaniesService))
        private readonly service: CompaniesService,
    ) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreateCompanyDto) {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId);
        const payloadTransformed = deepStringToShortDate(payload);
        const company = await this.service.create(
            userId,
            deepStringToShortDate(payloadTransformed),
        );
        return company;
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Query() relations: boolean) {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId);
        return await this.service.findAll(userId, relations);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query() relations: boolean,
    ) {
        const userId = getUserId(req);
        await this.service.availableFindOneOrFail(userId, id);
        return await this.service.findOne(userId, id, relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateCompanyDto,
    ) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Get(':id/calculate-payroll')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async salaryCalculate(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        await this.service.calculatePayroll(userId, id);
    }
}
