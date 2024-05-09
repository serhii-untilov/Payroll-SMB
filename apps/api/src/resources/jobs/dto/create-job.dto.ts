import { ApiProperty } from '@nestjs/swagger';
import { ICreateJob } from '@repo/shared';

export class CreateJobDto implements ICreateJob {
    @ApiProperty() name: string;
}
