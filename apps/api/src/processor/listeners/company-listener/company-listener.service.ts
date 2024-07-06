import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServerEvent } from '@repo/shared';
import { CompanyCreatedEvent } from '../../../resources/companies/events/company-created.event';
import { PaymentCalculationService } from '../../paymentCalculation/payment-calculation.service';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';
import { PayFundCalculationService } from './../../../processor/payFundCalculation/payFundCalculation.service';
import { CompanyDeletedEvent } from './../../../resources/companies/events/company-deleted.event';
import { CompanyUpdatedEvent } from './../../../resources/companies/events/company-updated.event';
import { PayPeriodCalculationService } from './../../payPeriodCalculation/payPeriodCalculation.service';
import { PayrollCalculationService } from './../../payrollCalculation/payrollCalculation.service';
import { SseService } from './../../serverSentEvents/sse.service';

@Injectable()
export class CompanyListenerService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);

    constructor(
        @Inject(forwardRef(() => PayrollCalculationService))
        private payrollCalculationService: PayrollCalculationService,
        @Inject(forwardRef(() => PaymentCalculationService))
        private paymentCalculationService: PaymentCalculationService,
        @Inject(forwardRef(() => PayFundCalculationService))
        private payFundCalculationService: PayFundCalculationService,
        @Inject(forwardRef(() => TaskGenerationService))
        private taskListService: TaskGenerationService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        private payPeriodCalculationService: PayPeriodCalculationService,
        @Inject(forwardRef(() => SseService))
        private sseService: SseService,
    ) {}

    @OnEvent('company.created')
    async handleCompanyCreatedEvent(event: CompanyCreatedEvent) {
        this._logger.log(`handling ['company.created'] ${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    @OnEvent('company.updated')
    async handleCompanyUpdatedEvent(event: CompanyUpdatedEvent) {
        this._logger.log(`handling ['company.updated'] ${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    @OnEvent('company.deleted')
    async handleCompanyDeletedEvent(event: CompanyDeletedEvent) {
        this._logger.log(`handling ['company.deleted'] ${JSON.stringify(event)}`);
    }

    @OnEvent('company.calculate')
    async handleCompanyCalculateEvent(event: CompanyCreatedEvent) {
        this._logger.log(`handling ['company.calculate'] ${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    private async runBatch(userId: number, companyId: number) {
        try {
            this._logger.log(`companyId ${companyId} ${ServerEvent.PAYROLL_STARTED}`);
            this.sseService.event(companyId, { data: ServerEvent.PAYROLL_STARTED });
            await this.payPeriodCalculationService.fillPeriods(userId, companyId);
            await this.payrollCalculationService.calculateCompany(userId, companyId);
            await this.payFundCalculationService.calculateCompany(userId, companyId);
            await this.paymentCalculationService.calculateCompany(userId, companyId);
            await this.payrollCalculationService.calculateCompanyTotals(userId, companyId);
            await this.taskListService.generate(userId, companyId);
            this._logger.log(`companyId ${companyId} ${ServerEvent.PAYROLL_FINISHED}`);
            this.sseService.event(companyId, { data: ServerEvent.PAYROLL_FINISHED });
        } catch (_e) {
            this._logger.fatal(`companyId ${companyId} ${ServerEvent.PAYROLL_FAILED}`);
            this.sseService.event(companyId, { data: ServerEvent.PAYROLL_FAILED });
        }
    }
}
