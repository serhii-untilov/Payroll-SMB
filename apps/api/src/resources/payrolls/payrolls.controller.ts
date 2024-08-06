import { Payroll } from './entities/payroll.entity';
import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    getSchemaPath,
} from '@nestjs/swagger';
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { FindPayrollDto } from './dto/find-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { PayrollsService } from './payrolls.service';

@Controller('payroll')
@ApiBearerAuth()
export class PayrollsController {
    constructor(private readonly service: PayrollsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create payroll' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: Payroll,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePayrollDto): Promise<Payroll> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(payload.positionId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Payroll) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: 'Bad request' })
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

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: Payroll })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
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
    @ApiOperation({ summary: 'Update payroll' })
    @ApiOkResponse({ description: 'The updated record', type: Payroll })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
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
    @ApiOperation({ summary: 'Soft delete payroll' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Payroll })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Payroll> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }
}
