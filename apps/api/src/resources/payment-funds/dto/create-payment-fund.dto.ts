export class CreatePaymentFundDto {
    id: number;
    paymentPositionId: number;
    payFundTypeId: number;
    baseSum: number;
    paySum: number;
    recordFlags: number; // See enum RecordFlags
}
