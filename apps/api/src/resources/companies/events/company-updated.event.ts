export class CompanyUpdatedEvent {
    constructor(
        readonly userId: string,
        readonly companyId: string,
    ) {}
}
