import { PayFundCalculationService } from '@/processor/pay-fund-calculation/pay-fund-calculation.service';
import { PayPeriodCalculationService } from '@/processor/pay-period-calculation/pay-period-calculation.service';
import { PaymentCalculationService } from '@/processor/payment-calculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payroll-calculation/payroll-calculation.service';
import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/task-generator.service';
import { CalculateCompanyEvent, CompanyCreatedEvent, CompanyDeletedEvent, CompanyUpdatedEvent } from '@/resources';
import { ServerEvent } from '@/types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CompanyListenerService {
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
        private readonly logger = new Logger(CompanyListenerService.name),
    ) {}

    @OnEvent(CompanyCreatedEvent.name)
    async handleCompanyCreatedEvent(event: CompanyCreatedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    @OnEvent(CompanyUpdatedEvent.name)
    async handleCompanyUpdatedEvent(event: CompanyUpdatedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    @OnEvent(CompanyDeletedEvent.name)
    async handleCompanyDeletedEvent(event: CompanyDeletedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
    }

    @OnEvent(CalculateCompanyEvent.name)
    async handleCompanyCalculateEvent(event: CalculateCompanyEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    private async runBatch(userId: string, companyId: string) {
        try {
            this.logger.log(`companyId ${companyId} ${ServerEvent.PayrollStarted}`);
            this.sseService.event(companyId, { data: ServerEvent.PayrollStarted });
            await this.payPeriodCalculationService.fillPeriods(userId, companyId);
            await this.payrollCalculationService.calculateCompany(userId, companyId);
            await this.payFundCalculationService.calculateCompany(userId, companyId);
            await this.paymentCalculationService.calculateCompany(userId, companyId);
            await this.payrollCalculationService.calculateCompanyTotals(userId, companyId);
            await this.taskListService.generate(userId, companyId);
            this.logger.log(`companyId ${companyId} ${ServerEvent.PayrollFinished}`);
            this.sseService.event(companyId, { data: ServerEvent.PayrollFinished });
        } catch (e) {
            this.logger.fatal(`companyId ${companyId} ${ServerEvent.PayrollFailed} ${e}`);
            this.sseService.event(companyId, { data: ServerEvent.PayrollFailed });
        }
    }
}
