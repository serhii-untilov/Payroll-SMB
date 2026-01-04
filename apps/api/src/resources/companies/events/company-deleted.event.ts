export class CompanyDeletedEvent {
    constructor(
        readonly userId: string,
        readonly companyId: string,
    ) {}
}
