import { Person } from '@/resources/persons/entities/person.entity';
import { PositionHistory } from '@/resources/position-history/entities/position-history.entity';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { PositionBalance } from '../entities/position-balance.entity';
import { Position } from '../entities/position.entity';
import { CalcMethodBalanceDto } from './calc-method-balance.dto';

export class PositionBalanceExtendedDto extends IntersectionType(
    PositionBalance,
    PickType(Position, [
        'companyId',
        'cardNumber',
        'sequenceNumber',
        'personId',
        'dateFrom',
        'dateTo',
    ]),
    PickType(Person, ['firstName', 'lastName', 'middleName', 'taxId']),
    PickType(PositionHistory, [
        'departmentId',
        'jobId',
        'workNormId',
        'paymentTypeId',
        'wage',
        'rate',
    ]),
) {
    departmentName?: string;
    jobName?: string;
    workNormName?: string;
    paymentTypeName?: string;
    calcMethod?: string;
    paySumECB?: number;
    calcMethodBalance: CalcMethodBalanceDto[];
}
