import { ICompany } from './company.interface';

export interface IDepartment {
    id: number;
    company: ICompany;
    name: string;
    parent: IDepartment | null | undefined;
}

export type ICreateDepartment = Omit<IDepartment, 'id'>;
export type IUpdateDepartment = Partial<Omit<IDepartment, 'id'>>;
