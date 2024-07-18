import { PayPeriodCalculationService } from '@/processor/pay-period-calculation/pay-period-calculation.service';
import { PayFundCalculationService } from '@/processor/payFundCalculation/payFundCalculation.service';
import { PaymentCalculationService } from '@/processor/paymentCalculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payroll-calculation/payrollCalculation.service';
import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/taskGeneration.service';
import { CompanyCreatedEvent, CompanyDeletedEvent, CompanyUpdatedEvent } from '@/resources';
import { ServerEvent } from '@/types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CompanyListenerService {
    private _logger: Logger = new Logger(CompanyListenerService.name);

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
        } catch (e) {
            this._logger.fatal(`companyId ${companyId} ${ServerEvent.PAYROLL_FAILED} ${e}`);
            this.sseService.event(companyId, { data: ServerEvent.PAYROLL_FAILED });
        }
    }
}
