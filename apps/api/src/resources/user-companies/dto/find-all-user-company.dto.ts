export class FindAllUserCompanyDto {
    userId: number;
    relations?: boolean = false;
    withDeleted?: boolean = false;
}
