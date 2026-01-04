import { CompanyReadDto } from './company-read.dto';

export const COMPANY_SORTABLE_FIELDS = [
    'name',
    'taxId',
    'dateFrom',
    'payPeriod',
] as const satisfies readonly (keyof CompanyListItemDto)[];

export class CompanyListItemDto extends CompanyReadDto {}
