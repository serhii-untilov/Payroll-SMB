import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { CalcMethod, PaymentGroup } from '@repo/shared';
import { PayPeriod } from '../../resources/pay-periods/entities/payPeriod.entity';
import { PayPeriodsService } from '../../resources/pay-periods/payPeriods.service';
import { PayPeriodCalculationService } from '../payPeriodCalculation/payPeriodCalculation.service';
import { CompaniesService } from './../../resources/companies/companies.service';
import { Company } from './../../resources/companies/entities/company.entity';
import { PaymentType } from './../../resources/payment-types/entities/payment-type.entity';
import { PaymentTypesService } from './../../resources/payment-types/payment-types.service';
import { Payment } from './../../resources/payments/entities/payment.entity';
import { PaymentPosition } from './../../resources/payments/entities/paymentPosition.entity';
import { PaymentPositionsService } from './../../resources/payments/payment-positions.service';
import { PaymentsService } from './../../resources/payments/payments.service';
import { Payroll } from './../../resources/payrolls/entities/payroll.entity';
import { PayrollsService } from './../../resources/payrolls/payrolls.service';
import { Position } from './../../resources/positions/entities/position.entity';
import { PositionsService } from './../../resources/positions/positions.service';
import { PaymentCalc_Advance } from './calcMethods/PaymentCalc_Advance';
import { PaymentCalc_Regular } from './calcMethods/PaymentCalc_Regular';
import { PaymentCalc_Fast } from './calcMethods/PaymentCalc_Fast';
import { PaymentCalc } from './calcMethods/abstract/PaymentCalc';

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

    public getNextPaymentPositionId(): number {
        this._paymentPositionId++;
        return this._paymentPositionId;
    }

    public merge(): { toInsert: Payment[]; toDeleteIds: number[] } {
        const toInsert: Payment[] = [];
        const toDeleteIds: number[] = [];
        // TODO
        return { toInsert, toDeleteIds };
    }

    private async loadResources() {
        this._paymentTypes = await this.paymentTypesService.findAll(null);
    }

    private initNextPaymentId() {
        this._paymentPositionId = this.paymentPositions.reduce((a, b) => Math.max(a, b.id), 0);
    }

    private async _calculatePosition() {
        this._payrolls = await this.payrollsService.findAll(this.userId, {
            positionId: this.position.id,
            payPeriod: this.payPeriod.dateFrom,
        });
        this._paymentPositions = await this.paymentPositionsService.findByPositionId(
            this.position.id,
            this.payPeriod.dateFrom,
        );
        this.initNextPaymentId();
        const paymentTypeList = this.paymentTypes.filter(
            (o) => o.paymentGroup === PaymentGroup.PAYMENTS,
        );
        const current: PaymentPosition[] = [];
        for (const paymentType of paymentTypeList) {
            const calcMethod = this.getCalcMethod(paymentType);
            if (calcMethod) {
                current.push(calcMethod.calculate());
            }
            const { toInsert, toDeleteIds } = this.merge();
            await this.save(toInsert, toDeleteIds);
        }
    }

    private getCalcMethod(paymentType: PaymentType): PaymentCalc {
        if (paymentType.calcMethod === CalcMethod.REGULAR_PAYMENT) {
            return new PaymentCalc_Regular(this);
        } else if (paymentType.calcMethod === CalcMethod.ADVANCE_PAYMENT) {
            return new PaymentCalc_Advance(this);
        } else if (paymentType.calcMethod === CalcMethod.FAST_PAYMENT) {
            return new PaymentCalc_Fast(this);
        }
        return null;
    }

    private async save(toInsert: Payment[], toDeleteIds: number[]) {
        await this.paymentsService.delete(toDeleteIds);
        for (const record of toInsert) {
            delete record.id;
            const created = await this.paymentsService.create(this.userId, record);
            this.logger.log(`PositionId: ${this.position.id}, Inserted: ${created.id}`);
        }
    }
}
