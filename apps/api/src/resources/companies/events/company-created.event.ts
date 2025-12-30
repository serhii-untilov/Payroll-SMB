import { Company } from './../entities/company.entity';

export class CompanyCreatedEvent {
    userId: string;
    companyId: string;
    constructor(userId: string, company: Company) {
        this.userId = userId;
        this.companyId = company.id;
    }
}
