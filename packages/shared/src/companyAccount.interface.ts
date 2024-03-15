import { IBank } from './bank.interface';
import { ICompany } from './company.interface';
import { ICurrency } from './currency.interface';
import { ILogger } from './logger.interface';

export interface ICompanyAccount extends ILogger {
    id: number;
    bankAccountNumber: string;

    company?: ICompany;
    companyId: number;

    bank?: IBank;
    bankId?: number | null;

    currency?: ICurrency;
    currencyId?: number | null;

    dateFrom?: Date;
    dateTo?: Date;

    description?: string | null;
}

export type ICreateCompanyAccount = Omit<
    ICompanyAccount,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateCompanyAccount = Partial<ICreateCompanyAccount>;
