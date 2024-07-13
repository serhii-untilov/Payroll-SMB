export class CreatePaymentPositionDto {
    paymentId: number;
    positionId: number;
    baseSum: number;
    deductions: number;
    paySum: number;
    funds: number;
    recordFlags: number; // See enum RecordFlags
}
