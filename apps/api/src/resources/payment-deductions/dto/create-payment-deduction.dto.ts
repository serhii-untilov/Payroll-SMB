export class CreatePaymentDeductionDto {
    id: number;
    paymentPositionId: number;
    paymentTypeId: number;
    baseSum: number;
    paySum: number;
    recordFlags: number; // See enum RecordFlags
}
