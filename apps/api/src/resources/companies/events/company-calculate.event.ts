import { Company } from '../entities/company.entity';

export class CompanyCalculateEvent {
    userId: number;
    companyId: number;
    constructor(userId: number, company: Company) {
        this.userId = userId;
        this.companyId = company.id;
    }
}
