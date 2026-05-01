import { CompanyReadDto } from '@/resources/company/dto/company-read.dto';
import { PayPeriod } from '@/resources/pay-periods/entities';
import { PaymentType } from '@/resources/payment-type/entities/payment-type.entity';
import { Position } from '@/resources/positions/entities';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { getPayrollUnionRecord } from '@/processor/helpers';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { WorkTimeNorm } from '@/resources/work-time-norm/entities';
import { RecordFlag } from '@/types';

export type PayrollContext = {
    userId: string;
    company: CompanyReadDto;
    payPeriod: PayPeriod;
    paymentTypes: PaymentType[];
    workTimeNorms: WorkTimeNorm[];
};

export abstract class CalculatePayroll {
    toInsert: Payroll[] = [];
    toDeleteIds: string[] = [];

    constructor(
        public ctx: PayrollContext,
        public position: Position,
        public payrolls: Payroll[],
        public accPeriods: PayPeriod[],
    ) {}

    abstract calculate(): void;

    public makePayroll(accPeriod: PayPeriod, paymentTypeId: string): Payroll {
        const payroll = new Payroll();
        payroll.id = IdGenerator.nextId();
        payroll.positionId = this.position.id;
        payroll.payPeriod = this.ctx.payPeriod.dateFrom;
        payroll.accPeriod = accPeriod.dateFrom;
        payroll.paymentTypeId = paymentTypeId;
        payroll.dateFrom = accPeriod.dateFrom;
        payroll.dateTo = accPeriod.dateTo;
        payroll.recordFlags = RecordFlag.Auto;
        return payroll;
    }

    public merge(paymentTypeIds: string[], accPeriod: PayPeriod, payrolls: Payroll[]) {
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
                toInsert.push(Object.assign({ ...record, id: IdGenerator.nextId() }));
            } else {
                processedIds.push(found.id); // memorize to avoid cancelling the found record
                const foundUnionCancel = getPayrollUnionRecord(found, this.payrolls, this.ctx.payPeriod);
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
                        found.payPeriod.getTime() >= this.ctx.payPeriod.dateFrom.getTime() &&
                        found.payPeriod.getTime() <= this.ctx.payPeriod.dateTo.getTime()
                    ) {
                        toDeleteIds.push(found.id);
                        // - put payrolls.record in the result
                        toInsert.push(
                            Object.assign({
                                ...record,
                                id: IdGenerator.nextId(),
                            }),
                        );
                    } else {
                        const cancelRecord: Payroll = Object.assign({
                            ...found,
                            id: IdGenerator.nextId(),
                            payPeriod: this.ctx.payPeriod.dateFrom,
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
                                id: IdGenerator.nextId(),
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
                o.payPeriod.getTime() <= this.ctx.payPeriod.dateTo.getTime() &&
                !(o.recordFlags & RecordFlag.Cancel) &&
                paymentTypeIds.includes(o.paymentTypeId) &&
                !processedIds.includes(o.id),
        );
        for (const record of toCancel) {
            if (
                record.recordFlags & RecordFlag.Auto &&
                record.payPeriod.getTime() >= this.ctx.payPeriod.dateFrom.getTime() &&
                record.payPeriod.getTime() <= this.ctx.payPeriod.dateTo.getTime()
            ) {
                toDeleteIds.push(record.id);
            } else {
                const recordUnionCancel = getPayrollUnionRecord(record, this.payrolls, this.ctx.payPeriod);
                toInsert.push(
                    Object.assign({
                        ...record,
                        id: IdGenerator.nextId(),
                        payPeriod: this.ctx.payPeriod.dateFrom,
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
}
