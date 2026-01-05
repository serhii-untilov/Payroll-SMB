import { CompanyReadDto } from './company-read.dto';

export const COMPANY_SORTING_MAP = {
    name: 'p.name',
    taxId: 'p.taxId',
    dateFrom: 'p.dateFrom',
    payPeriod: 'p.payPeriod',
} as const;

export type CompanySortableField = keyof typeof COMPANY_SORTING_MAP;

export class CompanyListItemDto extends CompanyReadDto {}
