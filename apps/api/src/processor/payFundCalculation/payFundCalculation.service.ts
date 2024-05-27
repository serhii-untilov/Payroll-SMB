import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { PayFundCalcMethod } from '@repo/shared';
import { CompaniesService } from './../../resources/companies/companies.service';
import { Company } from './../../resources/companies/entities/company.entity';
import { MinWage } from './../../resources/min-wage/entities/min-wage.entity';
import { MinWageService } from './../../resources/min-wage/min-wage.service';
import { PayFundType } from './../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFundTypesService } from './../../resources/pay-fund-types/pay-fund-types.service';
import { PayFund } from './../../resources/pay-funds/entities/pay-fund.entity';
import { PayFundsService } from './../../resources/pay-funds/pay-funds.service';
import { PayPeriod } from './../../resources/pay-periods/entities/pay-period.entity';
import { PayPeriodsService } from './../../resources/pay-periods/pay-periods.service';
import { PaymentType } from './../../resources/payment-types/entities/payment-type.entity';
import { PaymentTypesService } from './../../resources/payment-types/payment-types.service';
import { Payroll } from './../../resources/payrolls/entities/payroll.entity';
import { PayrollsService } from './../../resources/payrolls/payrolls.service';
import { Position } from './../../resources/positions/entities/position.entity';
import { PositionsService } from './../../resources/positions/positions.service';
import { PayFundCalc_ECB_MinWage } from './calcMethods/PayFundCalc_ECB_MinWage';
import { PayFundCalc_ECB_Salary } from './calcMethods/PayFundCalc_ECB_Salary';
import { PayFundCalc } from './calcMethods/abstract/PayFundCalc';

@Injectable({ scope: Scope.REQUEST })
export class PayFundCalculationService {
    private _logger: Logger = new Logger(PayFundCalculationService.name);
    private _userId: number;
    private _company: Company;
    private _paymentTypes: PaymentType[];
    private _payFundTypes: PayFundType[];
    private _minWages: MinWage[];
    private _position: Position;
    private _payPeriod: PayPeriod;
    private _accPeriods: PayPeriod[];
    private _payrolls: Payroll[];
    private _priorPayFunds: PayFund[];
    private _payFundId: number;

    constructor(
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
        @Inject(forwardRef(() => PaymentTypesService))
        private paymentTypesService: PaymentTypesService,
        @Inject(forwardRef(() => PayFundTypesService))
        private payFundTypesService: PayFundTypesService,
        @Inject(forwardRef(() => PayPeriodsService))
        private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService))
        private payrollsService: PayrollsService,
        @Inject(forwardRef(() => PayFundsService))
        private payFundsService: PayFundsService,
        @Inject(forwardRef(() => MinWageService))
        public minWageService: MinWageService,
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
    public get payFundTypes() {
        return this._payFundTypes;
    }
    public get minWages() {
        return this._minWages;
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
    public get priorPayFunds() {
        return this._priorPayFunds;
    }

    public async calculateCompany(userId: number, companyId: number) {
        this.logger.log(`userId: ${userId}, calculateCompany: ${companyId}`);
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
        await this._calculateCompanyTotals();
    }

    public async calculateCompanyTotals(userId: number, companyId: number) {
        this.logger.log(`userId: ${userId}, calculateCompanyTotals: ${companyId}`);
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, companyId);
        await this.loadResources();
        this._payPeriod = await this.payPeriodsService.findOne(userId, {
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        await this._calculateCompanyTotals();
    }

    private async _calculateCompanyTotals() {
        await this.payPeriodsService.updateBalance(this.payPeriod.id);
        await this.payPeriodsService.updateCalcMethods(this.payPeriod.id);
    }

    public async calculatePosition(userId: number, positionId: number) {
        this.logger.log(`userId: ${userId}, calculatePosition: ${positionId}`);
        this._position = await this.positionsService.findOne(userId, positionId, true);
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, this.position.companyId);
        await this.loadResources();
        this._payPeriod = await this.payPeriodsService.findOne(userId, {
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        await this._calculatePosition();
        await this._calculateCompanyTotals();
    }

    public getNextPayFundId(): number {
        this._payFundId++;
        return this._payFundId;
    }

    public merge(
        accPeriod: PayPeriod,
        currentPayFunds: PayFund[],
    ): { toInsert: PayFund[]; toDeleteIds: number[] } {
        const toInsert: PayFund[] = [];
        const toDeleteIds: number[] = [];
        const processedIds: number[] = [];
        // Sub prior from current
        this.priorPayFunds
            .filter(
                (o) =>
                    o.accPeriod.getTime() >= accPeriod.dateFrom.getTime() &&
                    o.accPeriod.getTime() <= accPeriod.dateTo.getTime() &&
                    o.payPeriod.getTime() <= this.payPeriod.dateTo.getTime(),
            )
            .forEach((prior) => {
                const current = currentPayFunds.find(
                    (record) =>
                        record.accPeriod.getTime() === prior.accPeriod.getTime() &&
                        record.payFundTypeId === prior.payFundTypeId &&
                        record.payFundCategory === prior.payFundCategory &&
                        !processedIds.includes(record.id),
                );
                if (current) {
                    if (current.paySum === prior.paySum) {
                        processedIds.push(current.id);
                    } else {
                        if (prior.payPeriod.getTime() === this.payPeriod.dateFrom.getTime()) {
                            toDeleteIds.push(prior.id);
                        } else {
                            toInsert.push(
                                Object.assign({
                                    ...prior,
                                    id: null,
                                    incomeSum: -prior.incomeSum,
                                    baseSum: -prior.baseSum,
                                    paySum: -prior.paySum,
                                }),
                            );
                        }
                    }
                } else {
                    if (prior.payPeriod.getTime() < this.payPeriod.dateFrom.getTime()) {
                        toInsert.push(
                            Object.assign({
                                ...prior,
                                id: null,
                                incomeSum: -prior.incomeSum,
                                baseSum: -prior.baseSum,
                                paySum: -prior.paySum,
                            }),
                        );
                    } else {
                        toDeleteIds.push(prior.id);
                    }
                }
            });
        // Push to insert if paySum not equal 0
        toInsert.push(
            ...currentPayFunds
                .filter((o) => o.paySum && !processedIds.includes(o.id))
                .reduce((a, b) => {
                    a.push(b);
                    return a;
                }, []),
        );
        return { toInsert, toDeleteIds };
    }

    private async loadResources() {
        this._paymentTypes = await this.paymentTypesService.findAll(null);
        this._payFundTypes = (await this.payFundTypesService.findAll()).sort(
            (a, b) => a.sequence - b.sequence,
        );
        this._minWages = await this.minWageService.findAll();
    }

    private initNextPayFundId() {
        this._payFundId = this.priorPayFunds.reduce((a, b) => Math.max(a, b.id), 0);
    }

    private getCalcMethod(
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ): PayFundCalc {
        if (payFundType.calcMethod === PayFundCalcMethod.ECB_SALARY) {
            return new PayFundCalc_ECB_Salary(this, accPeriod, payFundType, current);
        } else if (payFundType.calcMethod === PayFundCalcMethod.ECB_MIN_WAGE) {
            return new PayFundCalc_ECB_MinWage(this, accPeriod, payFundType, current);
        }
        return null;
    }

    private async _calculatePosition() {
        const dateFrom = await this.getMinCalculateDate(this.payPeriod.dateFrom);
        const dateTo = await this.getMaxCalculateDate(this.payPeriod.dateTo);
        this._accPeriods = await this.payPeriodsService.findAll(
            this.company.id,
            false,
            false,
            dateFrom,
            dateTo,
        );
        this._payrolls = await this.payrollsService.findBetween(
            this.userId,
            this.position.id,
            dateFrom,
            dateTo,
            true,
        );
        this._priorPayFunds = await this.payFundsService.findBetween(
            this.position.id,
            dateFrom,
            dateTo,
            true,
        );
        this.initNextPayFundId();
        for (const accPeriod of this.accPeriods) {
            const current: PayFund[] = [];
            this.payFundTypes.forEach((payFundType) => {
                const calcMethod = this.getCalcMethod(accPeriod, payFundType, current);
                if (calcMethod) {
                    const payFund = calcMethod.calculate();
                    current.push(payFund);
                }
            });
            const { toInsert, toDeleteIds } = this.merge(accPeriod, current);
            await this.save(toInsert, toDeleteIds);
        }
        // await this.positionsService.calculateBalance(this.position.id, this.payPeriod.dateFrom);
    }

    private async getMinCalculateDate(payPeriodDateFrom: Date): Promise<Date> {
        // TODO
        return payPeriodDateFrom;
    }

    private async getMaxCalculateDate(payPeriodDateTo: Date): Promise<Date> {
        // TODO
        return payPeriodDateTo;
    }

    private async save(toInsert: PayFund[], toDeleteIds: number[]) {
        for (let i = 0; i < toDeleteIds.length; ++i) {
            this.logger.log(`PositionId: ${this.position.id}, Delete: ${toDeleteIds[i]}`);
            await this.payFundsService.delete(this.userId, toDeleteIds[i]);
        }
        for (const record of toInsert) {
            delete record.id;
            const created = await this.payFundsService.create(this.userId, record);
            this.logger.log(`PositionId: ${this.position.id}, Inserted: ${created.id}`);
        }
    }
}
