export class CreatePaymentFundDto {
    id: string;
    paymentPositionId: string;
    payFundTypeId: string;
    baseSum: number;
    paySum: number;
    recordFlags: number; // See enum RecordFlags
}
