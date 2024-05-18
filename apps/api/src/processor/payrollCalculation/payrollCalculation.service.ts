import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { AccessType, PaymentGroup, RecordFlags, ResourceType } from '@repo/shared';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AccessService } from '../../resources/access/access.service';
import { CompaniesService } from '../../resources/companies/companies.service';
import { Company } from '../../resources/companies/entities/company.entity';
import { PayPeriodsService } from '../../resources/pay-periods/pay-periods.service';
import { PaymentType } from '../../resources/payment-types/entities/payment-type.entity';
import { PaymentTypesService } from '../../resources/payment-types/payment-types.service';
import { Payroll } from '../../resources/payrolls/entities/payroll.entity';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';
import { Position } from '../../resources/positions/entities/position.entity';
import { PositionsService } from '../../resources/positions/positions.service';
import { WorkNorm } from '../../resources/work-norms/entities/work-norm.entity';
import { WorkNormsService } from '../../resources/work-norms/work-norms.service';
import { PayPeriod } from '../../resources/pay-periods/entities/pay-period.entity';
import { calculateBasics } from './calcMethods/calculateBasic';
import { getPayrollUnionCancel } from './utils/payrollsData';

@Injectable({ scope: Scope.REQUEST })
export class PayrollCalculationService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);
    private _userId: number;
    private _company: Company;
    private _paymentTypes: PaymentType[];
    private _workNorms: WorkNorm[];
    private _position: Position;
    private _payPeriod: PayPeriod;
    private _accPeriods: PayPeriod[];
    private _payrolls: Payroll[];
    private _payrollId = 0;
    private _toInsert: Payroll[] = [];
    private _toDeleteIds: number[] = [];

    constructor(
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
        @Inject(forwardRef(() => PaymentTypesService))
        private paymentTypesService: PaymentTypesService,
        @Inject(forwardRef(() => PayPeriodsService))
        private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService))
        private payrollsService: PayrollsService,
        @Inject(forwardRef(() => WorkNormsService))
        public workNormsService: WorkNormsService,
    ) {}

    public get logger() {
        return this._logger;
    }
    public get userId() {
        return this._userId;
    }
    public get company() {
        return this._company;
    }
    public get paymentTypes() {
        return this._paymentTypes;
    }
    public get workNorms() {
        return this._workNorms;
    }
    public get position() {
        return this._position;
    }
    public get payPeriod() {
        return this._payPeriod;
    }
    public get accPeriods() {
        return this._accPeriods;
    }
    public get payrolls() {
        return this._payrolls;
    }

    public async calculateCompany(userId: number, companyId: number) {
        this.logger.log(`calculateCompany: ${companyId}, userId: ${userId}`);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            ResourceType.COMPANY,
            AccessType.UPDATE,
        );
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, companyId);
        await this.loadResources();
        this._payPeriod = await this.payPeriodsService.findOne(userId, {
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        const positions = await this.positionsService.findAll(userId, {
            companyId,
            onPayPeriodDate: this.company.payPeriod,
            employeesOnly: true,
            relations: true,
        });
        for (const position of positions) {
            this._position = position;
            await this._calculatePosition();
        }
    }

    public async calculatePosition(userId: number, positionId: number) {
        this.logger.log(`calculatePosition: ${positionId}, userId: ${userId}`);
        this._position = await this.positionsService.findOne(userId, positionId, true);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            this.position.companyId,
            ResourceType.COMPANY,
            AccessType.UPDATE,
        );
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, this.position.companyId);
        await this.loadResources();
        this._payPeriod = await this.payPeriodsService.findOne(userId, {
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        await this._calculatePosition();
    }

    public getNextPayrollId(): number {
        this._payrollId++;
        return this._payrollId;
    }

    public merge(paymentGroup: PaymentGroup, accPeriod: PayPeriod, payrolls: Payroll[]): void {
        const toInsert: Payroll[] = [];
        const toDeleteIds: number[] = [];
        const processedIds: number[] = [];
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
                    (o.recordFlags & RecordFlags.CANCEL) === 0,
            );
            if (!found) {
                toInsert.push(Object.assign({ ...record, id: this.getNextPayrollId() }));
            } else {
                processedIds.push(found.id); // memorize to avoid cancelling the found record
                const foundUnionCancel = getPayrollUnionCancel(
                    found,
                    this.payrolls,
                    this.payPeriod,
                );
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
                        found.recordFlags & RecordFlags.AUTO &&
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
                            recordFlags: RecordFlags.AUTO | RecordFlags.CANCEL,
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
        // Create cancel record in payrolls for record in this.payrolls which doesn't have the same record in payrolls
        const paymentTypeIds: number[] = this.paymentTypes
            .filter((o) => o.paymentGroup === paymentGroup)
            .map((o) => o.id);
        const toCancel: Payroll[] = this.payrolls.filter(
            (o) =>
                o.accPeriod.getTime() >= accPeriod.dateFrom.getTime() &&
                o.accPeriod.getTime() <= accPeriod.dateTo.getTime() &&
                o.payPeriod.getTime() <= this.payPeriod.dateTo.getTime() &&
                !(o.recordFlags & RecordFlags.CANCEL) &&
                paymentTypeIds.includes(o.paymentTypeId) &&
                !processedIds.includes(o.id),
        );
        for (const record of toCancel) {
            if (
                record.recordFlags & RecordFlags.AUTO &&
                record.payPeriod.getTime() >= this.payPeriod.dateFrom.getTime() &&
                record.payPeriod.getTime() <= this.payPeriod.dateTo.getTime()
            ) {
                toDeleteIds.push(record.id);
            } else {
                const recordUnionCancel = getPayrollUnionCancel(
                    record,
                    this.payrolls,
                    this.payPeriod,
                );
                toInsert.push(
                    Object.assign({
                        ...record,
                        id: this.getNextPayrollId(),
                        payPeriod: this.payPeriod.dateFrom,
                        sourceType: null,
                        sourceId: null,
                        recordFlags: RecordFlags.AUTO | RecordFlags.CANCEL,
                        fixedFlags: 0,
                        parentId: record.id,
                        factSum: -recordUnionCancel.factSum,
                        factDays: -recordUnionCancel.factDays,
                        factHours: -recordUnionCancel.factHours,
                    }),
                );
            }
        }
        this._toInsert.push(...toInsert);
        this._toDeleteIds.push(...toDeleteIds);
    }

    private async loadResources() {
        this._paymentTypes = await this.paymentTypesService.findAll(null);
        this._workNorms = await this.workNormsService.findAll(true);
    }

    private initNextPayrollId() {
        this._payrollId = this.payrolls.reduce((a, b) => Math.max(a, b.id), 0);
    }

    private async _calculatePosition() {
        this._toInsert = [];
        this._toDeleteIds = [];
        const dateFrom = await this.getMinCalculateDate(this.payPeriod.dateFrom);
        const dateTo = await this.getMaxCalculateDate(this.payPeriod.dateTo);
        this._accPeriods = await this.payPeriodsService.findAll(this.userId, this.company.id, {
            where: {
                dateFrom: MoreThanOrEqual(dateFrom),
                dateTo: LessThanOrEqual(dateTo),
            },
        });
        this._payrolls = await this.payrollsService.findBetween(
            this.userId,
            this.position.id,
            dateFrom,
            dateTo,
            true,
        );
        this.initNextPayrollId();
        calculateBasics(this); // Base salary (wage)
        await this.save();
        this._toInsert = [];
        this._toDeleteIds = [];
    }

    private async getMinCalculateDate(payPeriodDateFrom: Date): Promise<Date> {
        // TODO
        return payPeriodDateFrom;
    }

    private async getMaxCalculateDate(payPeriodDateTo: Date): Promise<Date> {
        // TODO
        return payPeriodDateTo;
    }

    private async save() {
        for (let i = 0; i < this._toDeleteIds.length; ++i) {
            this.logger.log(`PositionId: ${this.position.id}, Delete: ${this._toDeleteIds[i]}`);
            await this.payrollsService.delete(this.userId, this._toDeleteIds[i]);
        }
        const map = {};
        this._toInsert.sort((a, b) => (a.parentId || 0) - (b.parentId || 0));
        for (const record of this._toInsert) {
            const id = record.id;
            delete record.id;
            const parentId = record.parentId
                ? map[record.parentId.toString()] || record.parentId
                : record.parentId;
            const created = await this.payrollsService.create(this.userId, { ...record, parentId });
            this.logger.log(`PositionId: ${this.position.id}, Inserted: ${created.id}`);

            map[id.toString()] = created.id;
        }
    }
}
