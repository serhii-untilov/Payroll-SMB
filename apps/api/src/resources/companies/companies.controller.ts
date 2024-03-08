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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createCompanyDto: CreateCompanyDto) {
        const userId = req.user['sub'];
        return await this.companiesService.create(userId, createCompanyDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll() {
        return await this.companiesService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.companiesService.findOne({
            where: { id },
            relations: { law: true, accounting: true, owner: true },
        });
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
}
