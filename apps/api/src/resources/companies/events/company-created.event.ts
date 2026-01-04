export class CompanyCreatedEvent {
    constructor(
        readonly userId: string,
        readonly companyId: string,
    ) {}
}
