import { ApiProperty } from '@nestjs/swagger';
import { ICreatePayFundType } from '@repo/shared';
export class CreatePayFundTypeDto implements ICreatePayFundType {
    @ApiProperty() name: string;
    @ApiProperty() group: string; // See enum PayFundGroup
    @ApiProperty() calcMethod: string;
    @ApiProperty() sequence: number;
    @ApiProperty() description: string;
}
