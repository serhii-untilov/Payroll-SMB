import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreatePayPeriodCalcMethodDto } from './dto/create-pay-period-calc-method.dto';
import { UpdatePayPeriodCalcMethodDto } from './dto/update-pay-period-calc-method.dto';
import { PayPeriodCalcMethod } from './entities/pay-period-calc-method.entity';

@Injectable()
export class PayPeriodsCalcMethodService {
    constructor(
        @InjectRepository(PayPeriodCalcMethod)
        private repository: Repository<PayPeriodCalcMethod>,
    ) {}

    async create(payload: CreatePayPeriodCalcMethodDto): Promise<PayPeriodCalcMethod> {
        const existing = await this.repository.findOneBy({
            payPeriodId: payload.payPeriodId,
            calcMethod: payload.calcMethod,
        });
        if (existing) {
            throw new ConflictException(
                `Pay Period Calc Method ${payload.payPeriodId} already exists for PayPeriodId ${payload.payPeriodId}.`,
            );
        }
        return await this.repository.save(payload);
    }

    async findAll(options: FindManyOptions<PayPeriodCalcMethod>): Promise<PayPeriodCalcMethod[]> {
        return await this.repository.find(options);
    }

    async findOne(params: FindOneOptions<PayPeriodCalcMethod>): Promise<PayPeriodCalcMethod> {
        return await this.repository.findOneOrFail(params);
    }

    async update(id: number, payload: UpdatePayPeriodCalcMethodDto): Promise<PayPeriodCalcMethod> {
        await this.repository.findOneOrFail({ where: { id } });
        await this.repository.save({ ...payload, id });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async delete(ids: number[]) {
        await this.repository.delete(ids);
    }
}
