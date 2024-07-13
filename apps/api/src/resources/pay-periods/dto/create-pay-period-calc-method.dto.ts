export class CreatePayPeriodCalcMethodDto {
    payPeriodId: number;
    calcMethod: string; // See enum CalcMethod
    factSum: number;
}
