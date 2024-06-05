import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CompanyCreatedEvent } from '../../../resources/companies/events/company-created.event';
import { PayrollCalculationService } from './../../payrollCalculation/payrollCalculation.service';
import { CompanyUpdatedEvent } from './../../../resources/companies/events/company-updated.event';
import { PayFundCalculationService } from './../../../processor/payFundCalculation/payFundCalculation.service';
import { CompanyDeletedEvent } from './../../../resources/companies/events/company-deleted.event';
import { PayPeriodsService } from './../../../resources/pay-periods/pay-periods.service';
import { TaskListService } from './../../../processor/task-list/task-list.service';

@Injectable()
export class CompanyListenerService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);

    constructor(
        @Inject(forwardRef(() => PayrollCalculationService))
        private payrollCalculationService: PayrollCalculationService,
        @Inject(forwardRef(() => PayFundCalculationService))
        private payFundCalculationService: PayFundCalculationService,
        @Inject(forwardRef(() => PayPeriodsService))
        private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => TaskListService))
        private taskListService: TaskListService,
    ) {}

    @OnEvent('company.created')
    async handleCompanyCreatedEvent(event: CompanyCreatedEvent) {
        this._logger.log(`handling ['company.created'] ${JSON.stringify(event)}`);
        await this.payPeriodsService.fillPeriods(event.userId, event.companyId);
        await this.payrollCalculationService.calculateCompany(event.userId, event.companyId);
        await this.payFundCalculationService.calculateCompany(event.userId, event.companyId);
        await this.payrollCalculationService.calculateCompanyTotals(event.userId, event.companyId);
        await this.taskListService.generate(event.userId, event.companyId);
    }

    @OnEvent('company.updated')
    async handleCompanyUpdatedEvent(event: CompanyUpdatedEvent) {
        this._logger.log(`handling ['company.updated'] ${JSON.stringify(event)}`);
        await this.payPeriodsService.fillPeriods(event.userId, event.companyId);
        await this.payrollCalculationService.calculateCompany(event.userId, event.companyId);
        await this.payFundCalculationService.calculateCompany(event.userId, event.companyId);
        await this.payrollCalculationService.calculateCompanyTotals(event.userId, event.companyId);
    }

    @OnEvent('company.deleted')
    async handleCompanyDeletedEvent(event: CompanyDeletedEvent) {
        this._logger.log(`handling ['company.deleted'] ${JSON.stringify(event)}`);
        await this.taskListService.generate(event.userId, event.companyId);
    }

    @OnEvent('company.calculate')
    async handleCompanyCalculateEvent(event: CompanyCreatedEvent) {
        this._logger.log(`handling ['company.calculate'] ${JSON.stringify(event)}`);
        await this.payrollCalculationService.calculateCompany(event.userId, event.companyId);
        await this.payFundCalculationService.calculateCompany(event.userId, event.companyId);
        await this.payrollCalculationService.calculateCompanyTotals(event.userId, event.companyId);
        await this.taskListService.generate(event.userId, event.companyId);
    }
}
