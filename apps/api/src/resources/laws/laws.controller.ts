import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { LawsService } from './laws.service';
import { Law } from './entities/law.entity';

@Controller('laws')
export class LawsController {
    constructor(private readonly lawsService: LawsService) {}

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Law[]> {
        return await this.lawsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Law> {
        return await this.lawsService.findOne(id);
    }
}
