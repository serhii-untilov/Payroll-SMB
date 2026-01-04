import { BaseMapper } from '@/resources/common/mapper/base.mapper';
import { CompanyReadDto } from '../dto/company-read.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';
import { CompanyListItemDto } from '../dto/company-list-item.dto';
import { CreateCompanyDto } from '../dto/create-company.dto';

export class CompanyMapper extends BaseMapper<
    CompanyEntity,
    CompanyReadDto,
    CreateCompanyDto,
    UpdateCompanyDto,
    CompanyListItemDto
> {
    constructor() {
        super(CompanyEntity);
    }

    toReadDto(entity: CompanyEntity): CompanyReadDto {
        return {
            id: entity.id,
            name: entity.name,
            taxId: entity.taxId,
            lawId: entity.lawId,
            lawName: entity.law?.name,
            accountingId: entity.accountingId,
            accountingName: entity.accounting?.name,
            paymentSchedule: entity.paymentSchedule,
            dateFrom: entity.dateFrom,
            dateTo: entity.dateTo,
            payPeriod: entity.payPeriod,
            checkDate: entity.checkDate,
            version: entity.version,
        };
    }

    toListItemDto(entity: CompanyEntity): CompanyListItemDto {
        return this.toReadDto(entity);
    }
}
