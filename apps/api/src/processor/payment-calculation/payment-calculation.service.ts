import { Position } from './../../resources/positions/entities/position.entity';
import { Payroll } from './../../resources/payrolls/entities/payroll.entity';
import { PaymentType } from './../../resources/payment-types/entities/payment-type.entity';
import { PaymentPosition } from './../../resources/payment-positions/entities/paymentPosition.entity';
import { Payment } from './../../resources/payments/entities/payment.entity';
import { PayPeriod } from './../../resources/pay-periods/entities/pay-period.entity';
import { PayFund } from './../../resources/pay-funds/entities/pay-fund.entity';
import { Company } from './../../resources/companies/entities/company.entity';
import {
    CompaniesService,
    PayFundsService,
    PayPeriodsService,
    PaymentPositionsService,
    PaymentTypesService,
    PaymentsService,
    PayrollsService,
    PositionsService,
} from '@/resources';
import { CalcMethod, PaymentStatus } from '@/types';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { PaymentGroup } from '@/types';
import { dateUTC } from '@repo/shared';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { CalcAdvance, CalcFastPayment, CalcPayment, CalcRegularPayment } from './calc-methods';

@Injectable({ scope: Scope.REQUEST })
export class PaymentCalculationService {
    logger: Logger = new Logger(PaymentCalculationService.name);
    userId: number;
    company: Company;
    paymentTypes: PaymentType[];
    position: Position;
    payPeriod: PayPeriod;
    accPeriods: PayPeriod[];
    payrolls: Payroll[];
    payFunds: PayFund[];
    payments: Payment[];
    paymentPositions: PaymentPosition[];
    paymentPositionId: number;

    constructor(
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
        @Inject(forwardRef(() => PayFundsService))
        private payFundsService: PayFundsService,
        @Inject(forwardRef(() => PaymentsService))
        private paymentsService: PaymentsService,
        @Inject(forwardRef(() => PaymentPositionsService))
        private paymentPositionsService: PaymentPositionsService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        public payPeriodCalculationService: PayPeriodCalculationService,
    ) {}

    private initPaymentPositionId() {
        this.paymentPositionId = this.paymentPositions.reduce((a, b) => Math.max(a, b.id), 0);
    }

    public getNextPaymentPositionId(): number {
        this.paymentPositionId++;
        return this.paymentPositionId;
    }

    public async calculateCompany(userId: number, companyId: number) {
        this.logger.log(`userId: ${userId}, calculateCompany: ${companyId}`);
        this.userId = userId;
        this.company = await this.companiesService.findOne(userId, companyId);
        await this.loadResources();
        this.payPeriod = await this.payPeriodsService.findOneBy({
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        const positions = await this.positionsService.findAll({
            companyId,
            onPayPeriodDate: this.company.payPeriod,
            employeesOnly: true,
            relations: true,
        });
        this.payments = await this.paymentsService.findAll({
            companyId,
            accPeriod: this.payPeriod.dateFrom,
        });
        const changedPaymentIds: number[] = [];
        for (const position of positions) {
            this.position = position;
            changedPaymentIds.push(...(await this._calculatePosition()));
        }
        await this.paymentsService.updateTotals(
            this.userId,
            changedPaymentIds.filter(
                (id, index, array) => index === array.findIndex((o) => o === id),
            ),
        );
    }

    public async calculatePosition(userId: number, positionId: number) {
        this.logger.log(`userId: ${userId}, calculatePosition: ${positionId}`);
        this.position = await this.positionsService.findOne(positionId, { relations: true });
        this.userId = userId;
        this.company = await this.companiesService.findOne(userId, this.position.companyId);
        await this.loadResources();
        this.payPeriod = await this.payPeriodsService.findOneBy({
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        this.payments = await this.paymentsService.findAll({
            companyId: this.position.companyId,
            positionId,
            accPeriod: this.payPeriod.dateFrom,
        });
        const changedPaymentIds = await this._calculatePosition();
        await this.paymentsService.updateTotals(
            this.userId,
            changedPaymentIds.filter(
                (id, index, array) => index === array.findIndex((o) => o === id),
            ),
        );
    }

    private async _calculatePosition(): Promise<number[]> {
        this.payrolls = await this.getPayrolls();
        this.payFunds = await this.getPayFunds();
        this.paymentPositions = await this.getPaymentPositions();
        this.initPaymentPositionId();
        const paymentTypeList = this.paymentTypes.filter(
            (o) => o.paymentGroup === PaymentGroup.Payments,
        );
        const current: PaymentPosition[] = [];
        for (const paymentType of paymentTypeList) {
            // Pass copy of objects to prevent mutation
            const calcMethod = this.calcMethodFactory({ ...paymentType }, [...current]);
            if (calcMethod) {
                current.push(calcMethod.calculate());
            }
        }
        const { toInsert, toDelete } = this.merge(current);
        return await this.save(toInsert, toDelete);
    }

    private calcMethodFactory(paymentType: PaymentType, current: PaymentPosition[]): CalcPayment {
        if (paymentType.calcMethod === CalcMethod.RegularPayment) {
            return new CalcRegularPayment(this, paymentType, current);
        } else if (paymentType.calcMethod === CalcMethod.AdvancedPayment) {
            return new CalcAdvance(this, paymentType, current);
        } else if (paymentType.calcMethod === CalcMethod.FastPayment) {
            return new CalcFastPayment(this, paymentType, current);
        }
        throw new Error('Undefined calc method.');
    }

    private async save(
        toInsert: PaymentPosition[],
        toDelete: PaymentPosition[],
    ): Promise<number[]> {
        const changedPaymentIds: number[] = [];
        for (const paymentPosition of toDelete) {
            if (paymentPosition?.payment?.id) {
                changedPaymentIds.push(paymentPosition.payment.id);
                await this.paymentPositionsService.delete([paymentPosition.id]);
            }
        }
        for (const { id: _, ...paymentPosition } of toInsert) {
            let payment = this.payments.find(
                (o) =>
                    o.companyId === this.company.id &&
                    o.accPeriod.getTime() === paymentPosition?.payment?.accPeriod.getTime() &&
                    o.paymentTypeId === paymentPosition?.payment?.paymentTypeId &&
                    o.status === PaymentStatus.Draft,
            );
            if (!payment && paymentPosition?.payment) {
                payment = await this.createPayment(paymentPosition.payment);
            }
            if (!payment) {
                throw new Error('Payment not defined');
            }
            changedPaymentIds.push(payment.id);
            delete paymentPosition.payment;
            paymentPosition.paymentId = payment.id;
            const created = await this.paymentPositionsService.create(this.userId, paymentPosition);
            this.logger.log(`PositionId: ${this.position.id}, Inserted: ${created.id}`);
        }
        return changedPaymentIds;
    }

    private collapse(paymentPositions: PaymentPosition[]): PaymentPosition[] {
        return paymentPositions.reduce((a, b) => {
            const found = a.find((o) => o?.payment?.paymentTypeId === b?.payment?.paymentTypeId);
            if (found) {
                found.paySum = found.paySum + b.paySum;
            } else {
                a.push(b);
            }
            return a;
        }, [] as PaymentPosition[]);
    }

    private merge(current: PaymentPosition[]): {
        toDelete: PaymentPosition[];
        toInsert: PaymentPosition[];
    } {
        const toDelete: PaymentPosition[] = this.paymentPositions.filter(
            (p) =>
                p?.payment?.status === PaymentStatus.Draft &&
                !current.find(
                    (c) =>
                        c?.payment?.paymentTypeId === p?.payment?.paymentTypeId &&
                        c.baseSum === p.baseSum &&
                        c.deductions === p.deductions &&
                        c.funds === p.funds &&
                        c.paySum === p.paySum,
                ),
        );
        const paymentPositions = this.collapse(
            this.paymentPositions.filter((o) => !toDelete.find((d) => d.id === o.id)),
        );
        const toInsert: PaymentPosition[] = current
            .filter(
                (c) =>
                    !paymentPositions.find(
                        (p) =>
                            p?.payment?.paymentTypeId === c?.payment?.paymentTypeId &&
                            p.baseSum === c.baseSum &&
                            p.deductions === c.deductions &&
                            p.funds === c.funds &&
                            p.paySum === c.paySum,
                    ),
            )
            .map((c) => {
                const found = paymentPositions.find(
                    (p) => p?.payment?.paymentTypeId === c?.payment?.paymentTypeId,
                );
                if (found) {
                    c.baseSum = c.baseSum - found.baseSum;
                    c.deductions = c.deductions - found.deductions;
                    c.funds = c.funds - found.funds;
                    c.paySum = c.paySum - found.paySum;
                }
                return c;
            })
            .filter((o) => o.paySum > 0);
        return { toInsert, toDelete };
    }

    private async loadResources() {
        this.paymentTypes = await this.paymentTypesService.findAll();
    }

    private async getPayrolls(): Promise<Payroll[]> {
        return await this.payrollsService.findAll({
            positionId: this.position.id,
            payPeriod: this.payPeriod.dateFrom,
        });
    }

    private async getPayFunds(): Promise<PayFund[]> {
        return await this.payFundsService.findAll({
            positionId: this.position.id,
            payPeriod: this.payPeriod.dateFrom,
        });
    }

    private async getPaymentPositions(): Promise<PaymentPosition[]> {
        return await this.paymentPositionsService.findByPositionId(
            this.position.id,
            this.payPeriod.dateFrom,
        );
    }

    private async createPayment(payload: Payment): Promise<Payment> {
        const { id: _, ...payment } = payload;
        payment.docNumber = await this.paymentsService.getNextDocNumber(
            this.company.id,
            this.payPeriod.dateFrom,
        );
        payment.docDate = dateUTC(payment.dateFrom);
        return await this.paymentsService.create(this.userId, payment);
    }
}
