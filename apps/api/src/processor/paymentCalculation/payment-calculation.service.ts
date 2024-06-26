import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { CalcMethod, PaymentGroup, PaymentStatus, dateUTC } from '@repo/shared';
import { PayPeriod } from '../../resources/pay-periods/entities/payPeriod.entity';
import { PayPeriodsService } from '../../resources/pay-periods/payPeriods.service';
import { PayPeriodCalculationService } from '../payPeriodCalculation/payPeriodCalculation.service';
import { CompaniesService } from './../../resources/companies/companies.service';
import { Company } from './../../resources/companies/entities/company.entity';
import { PaymentType } from './../../resources/payment-types/entities/payment-type.entity';
import { PaymentTypesService } from './../../resources/payment-types/payment-types.service';
import { PaymentPosition } from './../../resources/payments/entities/paymentPosition.entity';
import { PaymentPositionsService } from './../../resources/payments/payment-positions.service';
import { PaymentsService } from './../../resources/payments/payments.service';
import { Payroll } from './../../resources/payrolls/entities/payroll.entity';
import { PayrollsService } from './../../resources/payrolls/payrolls.service';
import { Position } from './../../resources/positions/entities/position.entity';
import { PositionsService } from './../../resources/positions/positions.service';
import { PaymentCalc_Advance } from './calcMethods/PaymentCalc_Advance';
import { PaymentCalc_Fast } from './calcMethods/PaymentCalc_Fast';
import { PaymentCalc_Regular } from './calcMethods/PaymentCalc_Regular';
import { PaymentCalc } from './calcMethods/abstract/PaymentCalc';
import { Payment } from './../../resources/payments/entities/payment.entity';

@Injectable({ scope: Scope.REQUEST })
export class PaymentCalculationService {
    private _logger: Logger = new Logger(PaymentCalculationService.name);
    private _userId: number;
    private _company: Company;
    private _paymentTypes: PaymentType[];
    private _position: Position;
    private _payPeriod: PayPeriod;
    private _accPeriods: PayPeriod[];
    private _payrolls: Payroll[];
    private _paymentPositions: PaymentPosition[];
    private _paymentPositionId: number;

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
        @Inject(forwardRef(() => PaymentsService))
        private paymentsService: PaymentsService,
        @Inject(forwardRef(() => PaymentPositionsService))
        private paymentPositionsService: PaymentPositionsService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        public payPeriodCalculationService: PayPeriodCalculationService,
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
    public get paymentPositions() {
        return this._paymentPositions;
    }

    public async calculateCompany(userId: number, companyId: number) {
        this.logger.log(`userId: ${userId}, calculateCompany: ${companyId}`);
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, companyId);
        await this.loadResources();
        this._payPeriod = await this.payPeriodsService.findOne({
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
        this.logger.log(`userId: ${userId}, calculatePosition: ${positionId}`);
        this._position = await this.positionsService.findOne(positionId, true);
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, this.position.companyId);
        await this.loadResources();
        this._payPeriod = await this.payPeriodsService.findOne({
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        await this._calculatePosition();
    }

    private initPaymentPositionId() {
        this._paymentPositionId = this.paymentPositions.reduce((a, b) => Math.max(a, b.id), 0);
    }

    public getNextPaymentPositionId(): number {
        this._paymentPositionId++;
        return this._paymentPositionId;
    }

    private collapse(paymentPositions: PaymentPosition[]): PaymentPosition[] {
        return paymentPositions.reduce((a, b) => {
            const found = a.find((o) => o.payment.paymentTypeId === b.payment.paymentTypeId);
            if (found) {
                found.paySum = found.paySum + b.paySum;
            } else {
                a.push(b);
            }
            return a;
        }, []);
    }

    private merge(current: PaymentPosition[]): {
        toDeleteIds: number[];
        toInsert: PaymentPosition[];
    } {
        const toDeleteIds: number[] = this.paymentPositions
            .filter(
                (p) =>
                    p.payment.status === PaymentStatus.DRAFT &&
                    !current.find(
                        (c) =>
                            c.payment.paymentTypeId === p.payment.paymentTypeId &&
                            c.paySum === p.paySum,
                    ),
            )
            .map((o) => o.id);
        const paymentPositions = this.collapse(
            this.paymentPositions.filter((o) => !toDeleteIds.includes(o.id)),
        );
        const toInsert: PaymentPosition[] = current
            .filter(
                (c) =>
                    !paymentPositions.find(
                        (p) =>
                            p.payment.paymentTypeId === c.payment.paymentTypeId &&
                            p.paySum === c.paySum,
                    ),
            )
            .map((c) => {
                const found = paymentPositions.find(
                    (p) => p.payment.paymentTypeId === c.payment.paymentTypeId,
                );
                if (found) {
                    c.paySum = c.paySum - found.paySum;
                }
                return c;
            })
            .filter((o) => o.paySum > 0);
        return { toInsert, toDeleteIds };
    }

    private async loadResources() {
        this._paymentTypes = await this.paymentTypesService.findAll(null);
    }

    private async getPayrolls(): Promise<Payroll[]> {
        return await this.payrollsService.findAll(this.userId, {
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

    private async _calculatePosition() {
        this._payrolls = await this.getPayrolls();
        this._paymentPositions = await this.getPaymentPositions();
        this.initPaymentPositionId();
        const paymentTypeList = this.paymentTypes.filter(
            (o) => o.paymentGroup === PaymentGroup.PAYMENTS,
        );
        const current: PaymentPosition[] = [];
        for (const paymentType of paymentTypeList) {
            const calcMethod = this.getCalcMethod(paymentType);
            if (calcMethod) {
                current.push(calcMethod.calculate());
            }
        }
        const { toInsert, toDeleteIds } = this.merge(current);
        await this.save(toInsert, toDeleteIds);
    }

    private getCalcMethod(paymentType: PaymentType): PaymentCalc {
        if (paymentType.calcMethod === CalcMethod.REGULAR_PAYMENT) {
            return new PaymentCalc_Regular(this, paymentType);
        } else if (paymentType.calcMethod === CalcMethod.ADVANCE_PAYMENT) {
            return new PaymentCalc_Advance(this, paymentType);
        } else if (paymentType.calcMethod === CalcMethod.FAST_PAYMENT) {
            return new PaymentCalc_Fast(this, paymentType);
        }
        return null;
    }

    private async save(toInsert: PaymentPosition[], toDeleteIds: number[]) {
        if (toDeleteIds.length) {
            await this.paymentPositionsService.delete(toDeleteIds);
        }
        for (const paymentPosition of toInsert) {
            let payment = await this.paymentsService.findOneBy({
                companyId: this.company.id,
                paymentTypeId: paymentPosition.payment.paymentTypeId,
                status: PaymentStatus.DRAFT,
            });
            if (!payment) {
                payment = await this.createPayment(paymentPosition.payment);
            }
            delete paymentPosition.payment;
            delete paymentPosition.id;
            const created = await this.paymentPositionsService.create(this.userId, paymentPosition);
            this.logger.log(`PositionId: ${this.position.id}, Inserted: ${created.id}`);
        }
    }

    private async createPayment(payment: Payment): Promise<Payment> {
        delete payment.id;
        payment.docNumber = await this.paymentsService.getNextDocNumber(
            this.company.id,
            this.payPeriod.dateFrom,
        );
        payment.docDate = dateUTC(payment.dateFrom);
        return await this.paymentsService.create(this.userId, payment);
    }
}
