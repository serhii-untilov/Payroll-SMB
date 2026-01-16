export class CompanyRestoredEvent {
    constructor(
        readonly userId: string,
        readonly companyId: string,
    ) {}
}
