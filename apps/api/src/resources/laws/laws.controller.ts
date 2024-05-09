import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ILaw } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { LawsService } from './laws.service';

@Controller('laws')
export class LawsController {
    constructor(private readonly lawsService: LawsService) {}

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ILaw[]> {
        return await this.lawsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ILaw> {
        return await this.lawsService.findOne(id);
    }
}
