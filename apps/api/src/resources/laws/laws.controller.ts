import { AccessTokenGuard } from '@/guards';
import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import {
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    getSchemaPath,
} from '@nestjs/swagger';
import { Law } from './entities/law.entity';
import { LawsService } from './laws.service';

@Controller('laws')
export class LawsController {
    constructor(private readonly lawsService: LawsService) {}

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Law) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(): Promise<Law[]> {
        return await this.lawsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: Law })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Param('id', ParseIntPipe) id: string): Promise<Law> {
        return await this.lawsService.findOne(id);
    }
}
