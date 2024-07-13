import { ApiProperty } from '@nestjs/swagger';
export class CreateJobDto {
    @ApiProperty() name: string;
}
