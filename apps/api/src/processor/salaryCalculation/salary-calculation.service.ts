import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { AccessType, ResourceType } from '@repo/shared';
import { WorkNormsService } from '../../resources/work-norms/work-norms.service';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AccessService } from '../../resources/access/access.service';
import { CompaniesService } from '../../resources/companies/companies.service';
import { Company } from '../../resources/companies/entities/company.entity';
import { PayPeriod } from '../../resources/pay-periods/entities/pay-period.entity';
import { PayPeriodsService } from '../../resources/pay-periods/pay-periods.service';
import { Payroll } from '../../resources/payrolls/entities/payroll.entity';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';
import { Position } from '../../resources/positions/entities/position.entity';
import { PositionsService } from '../../resources/positions/positions.service';
import { calcBasics } from './calcMethods/calcBasic';

@Injectable()
export class SalaryCalculationService {
    private logger: Logger = new Logger(SalaryCalculationService.name);
    public company: Company;
    public position: Position;
    public payPeriod: PayPeriod;
    public accPeriods: PayPeriod[];
    public payrolls: Payroll[];
    private payrollId = 0;

    constructor(
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
        @Inject(forwardRef(() => PayPeriodsService))
        private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService))
        private payrollsService: PayrollsService,
        @Inject(forwardRef(() => WorkNormsService))
        public workNormsService: WorkNormsService,
    ) {}

    getNextId() {
        this.payrollId++;
        return this.payrollId;
    }

    async calculateCompany(userId: number, companyId: number) {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            ResourceType.COMPANY,
            AccessType.UPDATE,
        );
        const company = await this.companiesService.findOne(userId, companyId);
        this.logger.log(`calculateCompany: ${company.name}, userId: ${userId}`);
        const positions = await this.positionsService.findAll(userId, {
            companyId,
            onPayPeriodDate: company.payPeriod,
            employeesOnly: true,
        });
        for (const position of positions) {
            await this.calculatePosition(userId, position.id);
        }
    }

    async getMinCalculateDate(payPeriodDateFrom: Date): Promise<Date> {
        // TODO
        return payPeriodDateFrom;
    }

    async getMaxCalculateDate(payPeriodDateTo: Date): Promise<Date> {
        // TODO
        return payPeriodDateTo;
    }

    async calculatePosition(userId: number, positionId: number) {
        this.logger.log(`calculatePosition: ${positionId}, userId: ${userId}`);
        this.position = await this.positionsService.findOne(userId, positionId, true);
        this.company = await this.companiesService.findOne(userId, this.position.companyId);
        this.payPeriod = await this.payPeriodsService.findOne(userId, {
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        this.accPeriods = await this.payPeriodsService.findAll(userId, this.company.id, {
            where: {
                dateFrom: MoreThanOrEqual(await this.getMinCalculateDate(this.payPeriod.dateFrom)),
                dateTo: LessThanOrEqual(await this.getMaxCalculateDate(this.payPeriod.dateTo)),
            },
        });
        const dateFrom = await this.getMinCalculateDate(this.payPeriod.dateFrom);
        const dateTo = await this.getMaxCalculateDate(this.payPeriod.dateTo);
        this.payrolls = await this.payrollsService.findBetween(
            userId,
            positionId,
            dateFrom,
            dateTo,
            true,
        );
        const resultPayrolls: Payroll[] = [];
        await calcBasics(this, resultPayrolls); // Base salary (wage)
        await this.saveResult(userId, resultPayrolls);
    }

    static shrinkOrStorno(payrolls: Payroll[], newPayrolls: Payroll[]): Payroll[] {
        const result: Payroll[] = [];
        // TODO
        return result;
    }

    async saveResult(userId: number, result: Payroll[]) {
        for (const record of result) {
            await this.payrollsService.create(userId, record);
        }
    }
}
