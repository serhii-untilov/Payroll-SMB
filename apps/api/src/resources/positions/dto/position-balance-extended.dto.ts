import { Person } from './../../persons/entities/person.entity';
import { PositionHistory } from './../../position-history/entities/position-history.entity';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { PositionBalance } from './../entities/position-balance.entity';
import { Position } from './../entities/position.entity';
import { CalcMethodBalanceDto } from './calc-method-balance.dto';

export class PositionBalanceExtendedDto extends IntersectionType(
    PositionBalance,
    PickType(Position, ['companyId', 'cardNumber', 'sequenceNumber', 'personId', 'dateFrom', 'dateTo']),
    PickType(Person, ['firstName', 'lastName', 'middleName', 'taxId']),
    PickType(PositionHistory, ['departmentId', 'jobId', 'workTimeNormId', 'paymentTypeId', 'wage', 'rate']),
) {
    departmentName?: string;
    jobName?: string;
    workTimeNormName?: string;
    paymentTypeName?: string;
    calcMethod?: string;
    paySumECB?: number;
    calcMethodBalance: CalcMethodBalanceDto[];
}
