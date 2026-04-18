import { WorkTimeNorm } from '../../resources/work-time-norm/entities/work-time-norm.entity';
import { Position } from './../../resources/positions/entities/position.entity';
import { Payroll } from './../../resources/payrolls/entities/payroll.entity';
import { PaymentType } from './../../resources/payment-types/entities/payment-type.entity';
import { PayPeriod } from './../../resources/pay-periods/entities/pay-period.entity';
import { CompanyEntity } from '../../resources/company/entities/company.entity';
import { calcBalanceWorkTime, getPayrollUnionRecord } from '@/processor/helpers';
import {
    UserAccessService,
    CompanyService,
    PayPeriodsService,
    PaymentTypesService,
    PayrollsService,
    PositionsService,
    WorkTimeNormService,
} from '@/resources';
import { RecordFlag, WorkTime } from '@/types';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { calculateBasics, calculateIncomeTax, calculateMilitaryTax } from './calc-methods';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { PayrollContext } from './calc-methods/base/calculate-payroll.abstract';

@Injectable({ scope: Scope.REQUEST })
export class PayrollCalculationService {
    private logger: Logger = new Logger(PayrollCalculationService.name);
    // private userId: string;
    // private company: CompanyEntity;
    // private paymentTypes: PaymentType[];
    // private workTimeNorms: WorkTimeNorm[];
    // private position: Position;
    // public payPeriod: PayPeriod;
    // private accPeriods: PayPeriod[];
    // private payrolls: Payroll[];
    // // private _payrollId = 0;
    // private toInsert: Payroll[] = [];
    // private toDeleteIds: string[] = [];
    // // Synthetic working time, for totals only, not for calculate payroll
    // private syntheticTimePlan: WorkTime;
    // private syntheticTimeFact: WorkTime;

    constructor(
        @Inject(forwardRef(() => UserAccessService)) private accessService: UserAccessService,
        @Inject(forwardRef(() => CompanyService)) private companiesService: CompanyService,
        @Inject(forwardRef(() => PaymentTypesService)) private paymentTypesService: PaymentTypesService,
        @Inject(forwardRef(() => PayPeriodsService)) private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => PositionsService)) private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService)) private payrollsService: PayrollsService,
        @Inject(forwardRef(() => WorkTimeNormService)) public workTimeNormService: WorkTimeNormService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        private payPeriodCalculationService: PayPeriodCalculationService,
    ) {}

    // public get userId() {
    //     return this.userId;
    // }
    // public get company() {
    //     return this.company;
    // }
    // public get paymentTypes() {
    //     return this.paymentTypes;
    // }
    // public get workTimeNorms() {
    //     return this.workTimeNorms;
    // }
    // public get position() {
    //     return this.position;
    // }
    // // public get payPeriod() {
    // //     return this._payPeriod;
    // // }
    // public get accPeriods() {
    //     return this.accPeriods;
    // }
    // public get payrolls() {
    //     return this.payrolls;
    // }
    // public get syntheticTimePlan() {
    //     return this.syntheticTimePlan;
    // }
    // public get syntheticTimeFact() {
    //     return this.syntheticTimeFact;
    // }
    // public set syntheticTimePlan(plan: WorkTime) {
    //     this.syntheticTimePlan = plan;
    // }
    // public set syntheticTimeFact(fact: WorkTime) {
    //     this.syntheticTimeFact = fact;
    // }

    private async initContext(userId: string, companyId: string): Promise<PayrollContext> {
        const company = await this.companiesService.findOne(userId, companyId);
        return {
            userId,
            company,
            payPeriod: await this.payPeriodsService.findOneBy({
                where: { companyId, dateFrom: company.payPeriod },
            }),
            paymentTypes: await this.paymentTypesService.findAll(),
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
        await this._calculateCompanyTotals();
    }

    public async calculateCompanyTotals(userId: string, companyId: string) {
        this.logger.log(`userId: ${userId}, calculateCompanyTotals: ${companyId}`);
        this.userId = userId;
        this.company = await this.companiesService.findOne(userId, companyId);
        await this.loadResources();
        this.payPeriod = await this.payPeriodsService.findOneBy({
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        await this._calculateCompanyTotals();
    }

    private async _calculateCompanyTotals() {
        await this.payPeriodCalculationService.updateBalance(this.payPeriod.id);
        await this.payPeriodCalculationService.updateCalcMethods(this.payPeriod.id);
    }

    public async calculatePosition(userId: string, positionId: string) {
        this.logger.log(`userId: ${userId}, calculatePosition: ${positionId}`);
        this.position = await this.positionsService.findOne(positionId, { relations: true });
        this.userId = userId;
        this.company = await this.companiesService.findOne(userId, this.position.companyId);
        await this.loadResources();
        this.payPeriod = await this.payPeriodsService.findOneBy({
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        await this._calculatePosition();
        await this._calculateCompanyTotals();
    }

    public merge(paymentTypeIds: string[], accPeriod: PayPeriod, payrolls: Payroll[]): void {
        const toInsert: Payroll[] = [];
        const toDeleteIds: string[] = [];
        const processedIds: string[] = [];
        // When in this.payrolls exists the same record:
        // - skip record
        // When in this.payrolls exists the same record, but factSum doesn't the same:
        // - put additional cancel record for this.payrolls.record in the result
        // - put payrolls.record in the result
        for (const record of payrolls) {
            const found = this.payrolls.find(
                (o) =>
                    o.paymentTypeId === record.paymentTypeId &&
                    o.payPeriod.getTime() === record.payPeriod.getTime() &&
                    o.accPeriod.getTime() === record.accPeriod.getTime() &&
                    o.dateFrom.getTime() === record.dateFrom.getTime() &&
                    o.dateTo.getTime() === record.dateTo.getTime() &&
                    (o.recordFlags & RecordFlag.Cancel) === 0,
            );
            if (!found) {
                toInsert.push(Object.assign({ ...record, id: this.getNextPayrollId() }));
            } else {
                processedIds.push(found.id); // memorize to avoid cancelling the found record
                const foundUnionCancel = getPayrollUnionRecord(found, this.payrolls, this.payPeriod);
                if (
                    (record.factSum || 0) === (foundUnionCancel.factSum || 0) &&
                    (record.factDays || 0) === (foundUnionCancel.factDays || 0) &&
                    (record.factHours || 0) === (foundUnionCancel.factHours || 0) &&
                    (record.rate || 0) === (foundUnionCancel.rate || 0) &&
                    (record.planSum || 0) === (foundUnionCancel.planSum || 0) &&
                    (record.planDays || 0) === (foundUnionCancel.planDays || 0) &&
                    (record.planHours || 0) === (foundUnionCancel.planHours || 0)
                ) {
                    // skip record
                } else {
                    if (
                        found.recordFlags & RecordFlag.Auto &&
                        found.payPeriod.getTime() >= this.payPeriod.dateFrom.getTime() &&
                        found.payPeriod.getTime() <= this.payPeriod.dateTo.getTime()
                    ) {
                        toDeleteIds.push(found.id);
                        // - put payrolls.record in the result
                        toInsert.push(
                            Object.assign({
                                ...record,
                                id: this.getNextPayrollId(),
                            }),
                        );
                    } else {
                        const cancelRecord: Payroll = Object.assign({
                            ...found,
                            id: this.getNextPayrollId(),
                            payPeriod: this.payPeriod.dateFrom,
                            sourceType: null,
                            sourceId: null,
                            recordFlags: RecordFlag.Auto | RecordFlag.Cancel,
                            fixedFlags: 0,
                            parentId: found.id,
                            factSum: -foundUnionCancel.factSum,
                            factDays: -foundUnionCancel.factDays,
                            factHours: -foundUnionCancel.factHours,
                        });

                        // - put additional cancel record for this.payrolls.record in the result
                        toInsert.push(cancelRecord);
                        // - put payrolls.record in the result
                        toInsert.push(
                            Object.assign({
                                ...record,
                                id: this.getNextPayrollId(),
                                parentId: cancelRecord.id,
                            }),
                        );
                    }
                }
            }
        }
        // Create cancel record in payrolls for record in this.payrolls which
        // doesn't have the same record in payrolls
        const toCancel: Payroll[] = this.payrolls.filter(
            (o) =>
                o.accPeriod.getTime() >= accPeriod.dateFrom.getTime() &&
                o.accPeriod.getTime() <= accPeriod.dateTo.getTime() &&
                o.payPeriod.getTime() <= this.payPeriod.dateTo.getTime() &&
                !(o.recordFlags & RecordFlag.Cancel) &&
                paymentTypeIds.includes(o.paymentTypeId) &&
                !processedIds.includes(o.id),
        );
        for (const record of toCancel) {
            if (
                record.recordFlags & RecordFlag.Auto &&
                record.payPeriod.getTime() >= this.payPeriod.dateFrom.getTime() &&
                record.payPeriod.getTime() <= this.payPeriod.dateTo.getTime()
            ) {
                toDeleteIds.push(record.id);
            } else {
                const recordUnionCancel = getPayrollUnionRecord(record, this.payrolls, this.payPeriod);
                toInsert.push(
                    Object.assign({
                        ...record,
                        id: this.getNextPayrollId(),
                        payPeriod: this.payPeriod.dateFrom,
                        sourceType: null,
                        sourceId: null,
                        recordFlags: RecordFlag.Auto | RecordFlag.Cancel,
                        fixedFlags: 0,
                        parentId: record.id,
                        factSum: -recordUnionCancel.factSum,
                        factDays: -recordUnionCancel.factDays,
                        factHours: -recordUnionCancel.factHours,
                    }),
                );
            }
        }
        this.toInsert.push(...toInsert);
        this.toDeleteIds.push(...toDeleteIds);
    }

    private async _calculatePosition(ctx: PayrollContext, position: Position) {
        const toInsert: Payroll[] = [];
        const toDeleteIds: Payroll[] = [];
        const dateFrom = await this.getMinCalculateDate(ctx.payPeriod.dateFrom);
        const dateTo = await this.getMaxCalculateDate(ctx.payPeriod.dateTo);
        const accPeriods = await this.payPeriodsService.findAll({ companyId: ctx.company.id, dateFrom, dateTo });
        const payrolls = await this.payrollsService.findBetween(position.id, dateFrom, dateTo, true);
        calculateBasics(this);
        calculateIncomeTax(this);
        calculateMilitaryTax(this);
        await this.save();
        const balanceWorkingTime = calcBalanceWorkTime(this.workTimeNorms, this.position, this.payPeriod);
        await this.positionsService.calculateBalance(this.position.id, this.payPeriod.dateFrom, balanceWorkingTime);
        this.toInsert = [];
        this.toDeleteIds = [];
    }

    private async getMinCalculateDate(dateFrom: Date): Promise<Date> {
        // TODO
        return dateFrom;
    }

    private async getMaxCalculateDate(dateTo: Date): Promise<Date> {
        // TODO
        return dateTo;
    }

    public getPayrollsAccPeriod(accPeriod: Date) {
        return [
            ...this.payrolls.filter(
                (o) => o.accPeriod.getTime() === accPeriod.getTime() && !this.toDeleteIds.includes(o.id),
            ),
            ...this.toInsert.filter((o) => o.accPeriod.getTime() === accPeriod.getTime()),
        ];
    }

    private async save() {
        for (let i = 0; i < this.toDeleteIds.length; ++i) {
            this.logger.log(`PositionId: ${this.position.id}, Delete: ${this.toDeleteIds[i]}`);
            await this.payrollsService.delete(this.toDeleteIds[i]);
        }
        const map = {};
        this.toInsert.sort((a, b) => (BigInt(a.parentId ?? 0) < BigInt(b.parentId ?? 0) ? -1 : 1));
        for (const { id, parentId, ...record } of this.toInsert) {
            const newParentId: string = parentId ? map[parentId.toString()] || parentId : parentId;
            const created = await this.payrollsService.create(this.userId, {
                ...record,
                ...(newParentId ? { parentId: newParentId } : {}),
            });
            this.logger.log(`PositionId: ${this.position.id}, Inserted: ${created.id}`);

            map[id.toString()] = created.id;
        }
    }

    private async clean() {
        await this.payrollsService.deleteBy({
            positionId: this.position.id,
        });
        await this.positionsService.deletePositionBalanceBy({
            positionId: this.position.id,
        });
    }
}
