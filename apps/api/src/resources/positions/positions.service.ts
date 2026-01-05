import { WorkTimeBalance, PaymentPart, Resource, WrapperType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { MAX_SEQUENCE_NUMBER, maxDate } from '@repo/shared';
import { sub } from 'date-fns';
import {
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    IsNull,
    LessThan,
    LessThanOrEqual,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';
import { AvailableForUserCompany } from '../common/base/available-for-user-company';
import { UserAccessService } from '../user-access/user-access.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { PayrollsService } from '../payrolls/payrolls.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { FindAllPositionDto } from './dto/find-all-position.dto';
import { FindOnePositionDto } from './dto/find-one-position.dto';
import { FindAllPositionBalanceDto } from './dto/find-position-balance.dto';
import { FindPositionByPersonDto } from './dto/find-position-by-person.dto';
import { PositionBalanceExtendedDto } from './dto/position-balance-extended.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionBalance } from './entities/position-balance.entity';
import { Position } from './entities/position.entity';
import { PositionCreatedEvent } from './events/position-created.event';
import { PositionDeletedEvent } from './events/position-deleted.event';
import { PositionUpdatedEvent } from './events/position-updated.event';

@Injectable()
export class PositionsService extends AvailableForUserCompany {
    public readonly resource = Resource.Position;

    constructor(
        @InjectRepository(Position)
        private repository: Repository<Position>,
        @InjectRepository(PositionBalance)
        private repositoryPositionBalance: Repository<PositionBalance>,
        @Inject(forwardRef(() => PayPeriodsService))
        private readonly payPeriodsService: WrapperType<PayPeriodsService>,
        @Inject(forwardRef(() => PayrollsService))
        private payrollsService: WrapperType<PayrollsService>,
        private eventEmitter: EventEmitter2,
        @Inject(forwardRef(() => UserAccessService))
        accessService: WrapperType<UserAccessService>,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: string): Promise<string> {
        return (
            await this.repository.findOneOrFail({
                select: { companyId: true },
                where: { id: entityId },
                withDeleted: true,
            })
        ).companyId;
    }

    async create(userId: string, payload: CreatePositionDto): Promise<Position> {
        if (payload?.cardNumber) {
            const existing = payload?.cardNumber
                ? await this.repository.findOne({
                      where: { cardNumber: payload.cardNumber },
                  })
                : null;
            if (existing) {
                throw new BadRequestException(`Position '${payload.cardNumber}' already exists.`);
            }
        }

        const cardNumber = payload?.cardNumber || (await this.getNextCardNumber(payload.companyId));
        const sequenceNumber = payload.sequenceNumber || MAX_SEQUENCE_NUMBER;
        const created = await this.repository.save({
            ...payload,
            cardNumber,
            sequenceNumber,
            createdUserId: userId,
            updatedUserId: userId,
        });
        this.eventEmitter.emit('position.created', new PositionCreatedEvent(userId, created));
        return created;
    }

    async findAll(payload: FindAllPositionDto): Promise<Position[]> {
        const {
            companyId,
            onDate,
            onPayPeriodDate,
            relations,
            employeesOnly,
            vacanciesOnly,
            dismissedOnly,
            deletedOnly,
            includeDeleted,
        } = payload;
        const payPeriod = onPayPeriodDate
            ? await this.payPeriodsService.findOneBy({
                  where: {
                      companyId,
                      dateFrom: onPayPeriodDate,
                  },
              })
            : null;
        const options: FindManyOptions<Partial<Position>> = {
            relations: {
                company: !!relations,
                person: !!relations,
                history: !!relations
                    ? {
                          department: true,
                          job: true,
                          workTimeNorm: true,
                          paymentType: true,
                      }
                    : false,
                ...(onDate
                    ? {
                          history: {
                              department: true,
                              job: true,
                              workTimeNorm: true,
                              paymentType: true,
                          },
                      }
                    : {}),
                ...(onPayPeriodDate
                    ? {
                          history: {
                              department: true,
                              job: true,
                              workTimeNorm: true,
                              paymentType: true,
                          },
                      }
                    : {}),
            },
            withDeleted: deletedOnly || includeDeleted,
            where: {
                companyId,
                ...(deletedOnly ? { deletedDate: Not(IsNull()) } : {}),
                ...(employeesOnly ? { personId: Not(IsNull()) } : {}),
                ...(vacanciesOnly ? { personId: IsNull() } : {}),
                ...(onDate
                    ? {
                          dateFrom: LessThanOrEqual(onDate),
                          dateTo: MoreThanOrEqual(onDate),
                          history: {
                              dateTo: MoreThanOrEqual(onDate),
                              dateFrom: LessThanOrEqual(onDate),
                          },
                      }
                    : {}),
                ...(onPayPeriodDate && payPeriod
                    ? {
                          dateFrom: LessThanOrEqual(payPeriod?.dateTo),
                          dateTo: MoreThanOrEqual(payPeriod?.dateFrom),
                          history: {
                              dateTo: MoreThanOrEqual(payPeriod?.dateFrom),
                              dateFrom: LessThanOrEqual(payPeriod?.dateTo),
                          },
                      }
                    : {}),
                ...(dismissedOnly ? {} : {}),
                ...(dismissedOnly ? { dateTo: LessThan(maxDate()) } : {}),
            },
        };
        return await this.repository.find(options);
    }

    async findOne(id: string, params?: FindOnePositionDto): Promise<Position> {
        const onDate = params?.onDate;
        const onPayPeriodDate = params?.onPayPeriodDate;
        const relations = params?.relations || false;
        const position = await this.repository.findOneOrFail({
            withDeleted: !!params?.withDeleted,
            where: { id },
            relations: {
                company: relations,
                person: relations,
                history: relations
                    ? {
                          department: true,
                          job: true,
                          workTimeNorm: true,
                          paymentType: true,
                      }
                    : false,
            },
        });
        if (!(onDate || onPayPeriodDate)) {
            return position;
        }
        const payPeriod = onPayPeriodDate
            ? await this.payPeriodsService.findOneBy({
                  where: {
                      companyId: position.companyId,
                      dateFrom: onPayPeriodDate,
                  },
              })
            : null;
        const options: FindOneOptions<Partial<Position>> = {
            withDeleted: !!params?.withDeleted,
            relations: {
                company: true,
                person: !!relations,
                history: !!relations
                    ? {
                          department: true,
                          job: true,
                          workTimeNorm: true,
                          paymentType: true,
                      }
                    : false,
            },
            where: {
                id,
                ...(onDate
                    ? {
                          history: {
                              dateTo: MoreThanOrEqual(onDate),
                              dateFrom: LessThanOrEqual(onDate),
                          },
                      }
                    : {}),
                ...(onPayPeriodDate && payPeriod
                    ? {
                          history: {
                              dateTo: MoreThanOrEqual(payPeriod.dateFrom),
                              dateFrom: LessThanOrEqual(payPeriod.dateTo),
                          },
                      }
                    : {}),
            },
        };
        return await this.repository.findOneOrFail(options);
    }

    async update(userId: string, id: string, payload: UpdatePositionDto): Promise<Position> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, updated));
        return updated;
    }

    async remove(userId: string, id: string): Promise<Position> {
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        const deleted = await this.repository.findOneOrFail({
            where: { id },
            withDeleted: true,
        });
        this.eventEmitter.emit('position.deleted', new PositionDeletedEvent(userId, deleted));
        return deleted;
    }

    async deletePositionBalanceBy(params: FindOptionsWhere<PositionBalance>) {
        await this.repositoryPositionBalance.delete(params);
    }

    async getNextCardNumber(companyId: string): Promise<string> {
        const first = await this.repository.findOneBy({ companyId, cardNumber: '1' });
        if (!first) return '1';
        const result = await this.repository.query(
            `select coalesce(min(cast(p."cardNumber" as integer)), 0) + 1 "freeNumber"
            from position p
            where p."companyId" = $1
                and p."deletedUserId" is NULL
                and p."cardNumber" ~ '^[0-9\.]+$' is true
                and not exists (
                    select null
                    from position p2
                    where p2."companyId" = $2
                        and p2."deletedUserId" is NULL
                        and (p2."cardNumber") ~ '^[0-9\.]+$' is true
                        and cast(p2."cardNumber" as integer) = cast(p."cardNumber" as integer)  + 1
                )
            `,
            [companyId, companyId],
        );

        return result[0].freeNumber.toString();
    }

    async calculateBalance(positionId: string, payPeriod: Date, balanceWorkingTime: WorkTimeBalance) {
        const position = await this.repository.findOneByOrFail({ id: positionId });
        const prevPayPeriod = await this.payPeriodsService.findOneBy({
            where: {
                companyId: position.companyId,
                dateTo: sub(payPeriod, { days: 1 }),
            },
        });
        const prevPositionBalance = prevPayPeriod
            ? await this.repositoryPositionBalance.findOne({
                  where: { positionId, payPeriod: prevPayPeriod.dateFrom },
              })
            : null;
        const paymentParts = await this.payrollsService.payrollPositionPaymentParts(positionId, payPeriod);
        const paymentGroups = await this.payrollsService.payrollPositionPaymentGroups(positionId, payPeriod);
        const positionBalance =
            (await this.repositoryPositionBalance.findOne({
                where: { positionId, payPeriod },
            })) || {};
        const inBalance = prevPositionBalance?.outBalance || 0;
        return this.repositoryPositionBalance.save({
            ...positionBalance,
            positionId,
            payPeriod,
            inBalance,
            ...balanceWorkingTime,
            ...paymentParts,
            ...paymentGroups,
            outBalance:
                inBalance + (paymentParts[PaymentPart.Accruals] || 0) - (paymentParts[PaymentPart.Deductions] || 0),
        });
    }

    async findAllBalance(params: FindAllPositionBalanceDto): Promise<PositionBalanceExtendedDto[]> {
        const payPeriod = await this.payPeriodsService.findOneBy({
            where: {
                companyId: params.companyId,
                dateFrom: params.payPeriod,
            },
        });
        const result = await this.repositoryPositionBalance.query(
            `select
                pb.id, pb.position_id, p.company_id, pb.pay_period,
                pb.in_balance,
                pb.accruals, pb.deductions,
                pb.basic, pb.adjustments, pb.bonuses, pb.vacations, pb.sicks, pb.refunds, pb.other_accruals,
                pb.taxes, pb.payments, pb.other_deductions,
                pb.out_balance,
                p.card_number", p.sequence_number,
                to_char(p.date_from", 'yyyy-mm-dd') date_from,
                to_char(p.date_to, 'yyyy-mm-dd') date_to,
                p.person_id, p2.first_name, p2.last_lame, p2.middle_name, p2.tax_id,
                ph.department_id, d."name" department_name,
                ph.job_id, j."name" job_name,
                ph.work_time_norm_id, wn."name" work_time_norm_name,
                ph.payment_type_id, pt."name" payment_type_name, pt.calc_method,
                ph.wage, ph.rate,
                pb.plan_days, pb.plan_hours,
                pb.fact_days, pb.fact_hours,
                t1.pay_sum pay_sum_ecb
            from position_balance pb
            inner join position p on p.id = pb.position_id and p.company_id = $1
                and p.deleted_date is null
            inner join person p2 on p2.id = p.person_id
            inner join position_history ph on ph.position_id = p.id and ph.id =
            (	select max(ph2.id)
                from position_history ph2
                where ph2.position_id = p.id
                and ph2.date_from =
                (	select max(ph3.date_from)
                    from position_history ph3
                    where ph3.position_id = p.id
                    and ph3.date_from <= $2
                )
            )
            left join department d on d.id = ph.department_id
            left join job j on j.id = ph.job_id
            left join work_time_norm wn on wn.id = ph.work_time_norm_id
            left join payment_type pt on pt.id = ph.payment_type_id
            left join (
            	select ppf.id, sum(pf.pay_sum) pay_sum
            	from pay_fund pf
            	inner join position ppf on ppf.id = pf.position_id
            	inner join pay_fund_type pft on pft.id = pf.pay_fund_type_id
            	where ppf.company_id = $1
            		and pf.pay_period = $3
            		and pft.group = 'ECB'
            	group by ppf.id
            ) t1 on pb.position_id = t1.id
            where p.company_id = $1
                and pb.pay_period = $3`,
            [params.companyId, payPeriod.dateTo, payPeriod.dateFrom],
        );
        const calcMethodBalance = await this.payrollsService.payrollCompanyCalcMethodsByPositions(
            params.companyId,
            payPeriod.dateFrom,
        );
        return result.map((o: any) => {
            return {
                id: o.id,
                payPeriod: new Date(o.pay_period),
                positionId: o.position_id,
                companyId: o.company_id,
                firstName: o.first_name,
                lastName: o.last_name,
                middleName: o.middle_name,
                taxId: o.taxId,
                cardNumber: o.card_number,
                sequenceNumber: o.sequence_number,
                personId: o.person_id,
                departmentName: o.department_name,
                jobName: o.job_name,
                workTimeNormName: o.work_time_norm_name,
                paymentTypeName: o.payment_type_name,
                departmentId: o.department_id,
                jobId: o.job_id,
                workTimeNormId: o.work_time_norm_id,
                paymentTypeId: o.payment_type_id,
                calcMethod: o.calcMethod,
                dateFrom: new Date(o.date_from),
                dateTo: new Date(o.date_to),
                accruals: Number(o.accruals),
                adjustments: Number(o.adjustments),
                basic: Number(o.basic),
                bonuses: Number(o.bonuses),
                deductions: Number(o.deductions),
                inBalance: Number(o.in_balance),
                otherAccruals: Number(o.other_accruals),
                otherDeductions: Number(o.other_deductions),
                outBalance: Number(o.out_balance),
                payments: Number(o.payments),
                rate: Number(o.rate),
                refunds: Number(o.refunds),
                sicks: Number(o.sicks),
                taxes: Number(o.taxes),
                vacations: Number(o.vacations),
                wage: Number(o.wage),
                planDays: Number(o.plan_days),
                planHours: Number(o.plan_hours),
                factDays: Number(o.fact_days),
                factHours: Number(o.fact_hours),
                paySumECB: Number(o.pay_sum_ecb),
                calcMethodBalance: calcMethodBalance
                    .filter((b) => b.positionId === o.positionId)
                    .map((b) => {
                        return { calcMethod: b.calcMethod, factSum: Number(b.factSum) };
                    }),
            };
        });
    }

    async calcCompanyDebt(companyId: string, payPeriod: Date): Promise<number> {
        const result = await this.repositoryPositionBalance
            .createQueryBuilder('balance')
            .select('SUM(balance.outBalance)', 'companyDebt')
            .innerJoin('balance.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('balance.payPeriod = :payPeriod', { payPeriod })
            .andWhere('balance.outBalance > 0')
            .getRawOne();
        return Number(result?.companyDebt);
    }

    async calcEmployeeDebt(companyId: string, payPeriod: Date): Promise<number> {
        const result = await this.repositoryPositionBalance
            .createQueryBuilder('balance')
            .select('SUM(balance.outBalance)', 'employeeDebt')
            .innerJoin('balance.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('balance.payPeriod = :payPeriod', { payPeriod })
            .andWhere('balance.outBalance < 0')
            .getRawOne();
        return Number(result?.employeeDebt);
    }

    async countEmployees(companyId: string): Promise<number> {
        const { count } = await this.repository
            .createQueryBuilder('position')
            .select('COUNT(*)', 'count')
            .where('"companyId" = :companyId', { companyId })
            .andWhere('"deletedDate" is null')
            .andWhere('"personId" is not null')
            .getRawOne();
        return Number(count);
    }

    async findMany(params: FindManyOptions<Position>): Promise<Position[]> {
        return this.repository.find(params);
    }

    async findFirstByPersonId(params: FindPositionByPersonDto): Promise<Position> {
        const { companyId, personId, onDate, onPayPeriodDate, relations } = params;
        const position = await this.repository.findOneOrFail({
            where: { personId, companyId },
            relations: {
                company: !!relations,
                person: !!relations,
                history: !!relations
                    ? {
                          department: true,
                          job: true,
                          workTimeNorm: true,
                          paymentType: true,
                      }
                    : false,
            },
        });
        if (!(onDate || onPayPeriodDate)) {
            return position;
        }
        const payPeriod = onPayPeriodDate
            ? await this.payPeriodsService.findOneBy({
                  where: {
                      companyId: position.companyId,
                      dateFrom: onPayPeriodDate,
                  },
              })
            : null;
        const options: FindOneOptions<Partial<Position>> = {
            relations: {
                company: true,
                person: !!relations,
                history: !!relations
                    ? {
                          department: true,
                          job: true,
                          workTimeNorm: true,
                          paymentType: true,
                      }
                    : false,
            },
            where: {
                personId,
                companyId,
                ...(onDate
                    ? {
                          history: {
                              dateTo: MoreThanOrEqual(onDate),
                              dateFrom: LessThanOrEqual(onDate),
                          },
                      }
                    : {}),
                ...(onPayPeriodDate && payPeriod
                    ? {
                          history: {
                              dateTo: MoreThanOrEqual(payPeriod.dateFrom),
                              dateFrom: LessThanOrEqual(payPeriod.dateTo),
                          },
                      }
                    : {}),
            },
        };
        return await this.repository.findOneOrFail(options);
    }
}
