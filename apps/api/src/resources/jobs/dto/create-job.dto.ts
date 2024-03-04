import { ICreateJob } from '@repo/shared';

export class CreateJobDto implements ICreateJob {
    id: number;
    name: string;
}
