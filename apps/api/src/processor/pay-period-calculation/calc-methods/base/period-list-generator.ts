import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { CompanyReadDto } from '@/resources/company/dto/company-read.dto';

export type Context = {
    userId: string;
    company: CompanyReadDto;
};

export abstract class PeriodListGenerator {
    constructor(private ctx: Context) {}

    abstract getPeriodList(dateFrom: Date, dateTo: Date): PayPeriod[];

    makePeriod(): PayPeriod {
        return Object.assign({
            id: IdGenerator.nextId(),
            companyId: this.ctx.company.id,
        });
    }
}
