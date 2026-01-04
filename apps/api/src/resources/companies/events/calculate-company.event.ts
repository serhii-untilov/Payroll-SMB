export class CalculateCompanyEvent {
    constructor(
        readonly userId: string,
        readonly companyId: string,
    ) {}
}
