import { Injectable } from '@nestjs/common';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';

@Injectable()
export class LawsService {
    create(createLawDto: CreateLawDto) {
        return 'This action adds a new law';
    }

    findAll() {
        return `This action returns all laws`;
    }

    findOne(id: number) {
        return `This action returns a #${id} law`;
    }

    update(id: number, updateLawDto: UpdateLawDto) {
        return `This action updates a #${id} law`;
    }

    remove(id: number) {
        return `This action removes a #${id} law`;
    }
}
