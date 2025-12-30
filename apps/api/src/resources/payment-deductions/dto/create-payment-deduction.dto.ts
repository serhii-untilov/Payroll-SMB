export class CreatePaymentDeductionDto {
    id: string;
    paymentPositionId: string;
    paymentTypeId: string;
    baseSum: number;
    paySum: number;
    recordFlags: number; // See enum RecordFlags
}
