export class CreatePayFundTypeDto {
    name: string;
    group: string; // See enum PayFundGroup
    calcMethod: string;
    sequence: number;
    description: string;
}
