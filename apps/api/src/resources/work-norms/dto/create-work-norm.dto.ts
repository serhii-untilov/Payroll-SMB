import { ICreateWorkNorm } from '@repo/shared';

export class CreateWorkNormDto implements ICreateWorkNorm {
    id: number;
    name: string;

    type: string;
    dateFrom: Date;
    dateTo: Date;
}
