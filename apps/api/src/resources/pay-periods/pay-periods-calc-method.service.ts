import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreatePayPeriodSummaryDto } from './dto/create-pay-period-calc-method.dto';
import { UpdatePayPeriodSummaryDto } from './dto/update-pay-period-calc-method.dto';
import { PayPeriodSummary } from './entities/pay-period-summary.entity';

@Injectable()
export class PayPeriodsCalcMethodService {
    constructor(
        @InjectRepository(PayPeriodSummary)
        private repository: Repository<PayPeriodSummary>,
    ) {}

    async create(payload: CreatePayPeriodSummaryDto): Promise<PayPeriodSummary> {
        const existing = await this.repository.findOneBy({
            payPeriodId: payload.payPeriodId,
            calcMethod: payload.calcMethod,
        });
        if (existing) {
            throw new HttpException(
                `Pay Period Calc Method ${payload.payPeriodId} already exists for PayPeriodId ${payload.payPeriodId}.`,
                HttpStatus.CONFLICT,
            );
        }
        return await this.repository.save(payload);
    }

    async findAll(options: FindManyOptions<PayPeriodSummary>): Promise<PayPeriodSummary[]> {
        return await this.repository.find(options);
    }

    async findOne(params: FindOneOptions<PayPeriodSummary>): Promise<PayPeriodSummary> {
        return await this.repository.findOneOrFail(params);
    }

    async update(id: string, payload: UpdatePayPeriodSummaryDto): Promise<PayPeriodSummary> {
        await this.repository.findOneOrFail({ where: { id } });
        await this.repository.save({ ...payload, id });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async delete(ids: string[]) {
        await this.repository.delete(ids);
    }
}
