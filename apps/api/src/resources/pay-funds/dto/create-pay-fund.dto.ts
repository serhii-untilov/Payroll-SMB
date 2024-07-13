export class CreatePayFundDto {
    positionId: number;
    payPeriod: Date;
    accPeriod: Date;
    payFundTypeId: number;
    payFundCategory: string; // See enum PayFundCategory
    incomeSum: number;
    baseSum: number;
    rate: number;
    paySum: number;
}
