import { calcBalanceWorkTime } from '@/processor/helpers';
import {
    CompanyService,
    PayPeriodService,
    PaymentTypeService,
    PayrollsService,
    PositionsService,
    UserAccessService,
    WorkTimeNormService,
} from '@/resources';
import { PayPeriod } from '@/resources/pay-period/entities/pay-period.entity';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { Position } from '@/resources/positions/entities/position.entity';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { calculateBasics, calculateIncomeTax, calculateMilitaryTax } from './calc-methods';
import { PayrollContext } from './calc-methods/base/calculate-payroll.abstract';

@Injectable({ scope: Scope.REQUEST })
export class PayrollCalculationService {
    private logger: Logger = new Logger(PayrollCalculationService.name);

    constructor(
        @Inject(forwardRef(() => UserAccessService)) private accessService: UserAccessService,
        @Inject(forwardRef(() => CompanyService)) private companiesService: CompanyService,
        @Inject(forwardRef(() => PaymentTypeService)) private paymentTypeService: PaymentTypeService,
        @Inject(forwardRef(() => PayPeriodService)) private payPeriodsService: PayPeriodService,
        @Inject(forwardRef(() => PositionsService)) private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService)) private payrollsService: PayrollsService,
        @Inject(forwardRef(() => WorkTimeNormService)) public workTimeNormService: WorkTimeNormService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        private payPeriodCalculationService: PayPeriodCalculationService,
    ) {}

    private async initContext(userId: string, companyId: string): Promise<PayrollContext> {
        const company = await this.companiesService.findOne(userId, companyId);
        return {
            userId,
            company,
            payPeriod: await this.payPeriodsService.findOneBy({
                where: { companyId, dateFrom: company.payPeriod },
            }),
            paymentTypes: await this.paymentTypeService.findAll(),
            workTimeNorms: await this.workTimeNormService.findAll({ relations: true }),
        };
    }

    public async calculateCompany(userId: string, companyId: string) {
        this.logger.log(`userId: ${userId}, calculateCompany: ${companyId}`);
        const ctx = await this.initContext(userId, companyId);
        const positions = await this.positionsService.findAll({
            companyId,
            onPayPeriodDate: ctx.company.payPeriod,
            employeesOnly: true,
            relations: true,
        });
        for (const position of positions) {
            await this._calculatePosition(ctx, position);
        }
        await this._calculateCompanyTotals(ctx.payPeriod);
    }

    public async calculateCompanyTotals(userId: string, companyId: string) {
        this.logger.log(`userId: ${userId}, calculateCompanyTotals: ${companyId}`);
        const company = await this.companiesService.findOne(userId, companyId);
        const payPeriod = await this.payPeriodsService.findOneBy({
            where: { companyId: company.id, dateFrom: company.payPeriod },
        });
        await this._calculateCompanyTotals(payPeriod);
    }

    private async _calculateCompanyTotals(payPeriod: PayPeriod) {
        await this.payPeriodCalculationService.updateBalance(payPeriod.id);
        await this.payPeriodCalculationService.updateCalcMethods(payPeriod.id);
    }

    public async calculatePosition(userId: string, positionId: string) {
        this.logger.log(`userId: ${userId}, calculatePosition: ${positionId}`);
        const position = await this.positionsService.findOne(positionId, { relations: true });
        const ctx = await this.initContext(userId, position.companyId);
        await this._calculatePosition(ctx, position);
        await this._calculateCompanyTotals(ctx.payPeriod);
    }

    private async _calculatePosition(ctx: PayrollContext, position: Position) {
        const dateFrom = await this.getMinCalculateDate(ctx.payPeriod.dateFrom);
        const dateTo = await this.getMaxCalculateDate(ctx.payPeriod.dateTo);
        const accPeriods = await this.payPeriodsService.findAll({ companyId: ctx.company.id, dateFrom, dateTo });
        const payrolls = await this.payrollsService.findBetween(position.id, dateFrom, dateTo, true);

        const { toInsert, toDeleteIds } = this.collectCalculations(ctx, position, payrolls, accPeriods);

        await this.save(ctx, toInsert, toDeleteIds);

        const balanceWorkingTime = calcBalanceWorkTime(ctx.workTimeNorms, position, ctx.payPeriod);
        await this.positionsService.calculateBalance(position.id, ctx.payPeriod.dateFrom, balanceWorkingTime);
    }

    private collectCalculations(
        ctx: PayrollContext,
        position: Position,
        payrolls: Payroll[],
        accPeriods: PayPeriod[],
    ): { toInsert: Payroll[]; toDeleteIds: string[] } {
        const allToInsert: Payroll[] = [];
        const allToDeleteIds: string[] = [];

        const basics = calculateBasics(ctx, position, payrolls, accPeriods);
        allToInsert.push(...basics.toInsert);
        allToDeleteIds.push(...basics.toDeleteIds);

        const incomeTax = calculateIncomeTax(ctx, position, payrolls, accPeriods);
        allToInsert.push(...incomeTax.toInsert);
        allToDeleteIds.push(...incomeTax.toDeleteIds);

        const militaryTax = calculateMilitaryTax(ctx, position, payrolls, accPeriods);
        allToInsert.push(...militaryTax.toInsert);
        allToDeleteIds.push(...militaryTax.toDeleteIds);

        return { toInsert: allToInsert, toDeleteIds: allToDeleteIds };
    }

    private async getMinCalculateDate(dateFrom: Date): Promise<Date> {
        return dateFrom;
    }

    private async getMaxCalculateDate(dateTo: Date): Promise<Date> {
        return dateTo;
    }

    private async save(ctx: PayrollContext, toInsert: Payroll[], toDeleteIds: string[]) {
        for (const id of toDeleteIds) {
            this.logger.log(`PositionId: ${ctx.company.id}, Delete: ${id}`);
            await this.payrollsService.delete(id);
        }
        const map: Record<string, string> = {};
        toInsert.sort((a, b) => (BigInt(a.parentId ?? 0) < BigInt(b.parentId ?? 0) ? -1 : 1));
        for (const { id, parentId, ...record } of toInsert) {
            const newParentId = parentId ? (map[parentId] ?? parentId) : parentId;
            const created = await this.payrollsService.create(ctx.userId, {
                ...record,
                ...(newParentId ? { parentId: newParentId } : {}),
            });
            this.logger.log(`PositionId: ${ctx.company.id}, Inserted: ${created.id}`);
            map[id] = created.id;
        }
    }

    private async clean(positionId: string) {
        await this.payrollsService.deleteBy({ positionId });
        await this.positionsService.deletePositionBalanceBy({ positionId });
    }
}
