export class FindAllUserCompanyDto {
    userId: string;
    relations?: boolean = false;
    withDeleted?: boolean = false;
}
