import { AccessType, ResourceType } from './../../types';
import { AccessService } from '../access/access.service';

export abstract class AvailableForUserCompany {
    abstract readonly resourceType: ResourceType;
    accessService: AccessService;

    constructor(accessService: AccessService) {
        this.accessService = accessService;
    }

    // For update and delete methods
    abstract getCompanyId(entityId: number): Promise<number>;
    // { return (await this.repository.findOneOrFail({ where: { id: entityId } })).companyId; }

    async availableFindAllOrFail(userId: number, companyId: number) {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.Access,
        );
    }

    async availableFindOneOrFail(userId: number, companyId: number) {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.Access,
        );
    }

    async availableCreateOrFail(userId: number, companyId: number) {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.Create,
        );
    }

    async availableUpdateOrFail(userId: number, entityId: number) {
        const companyId = await this.getCompanyId(entityId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.Update,
        );
    }

    async availableDeleteOrFail(userId: number, entityId: number) {
        const companyId = await this.getCompanyId(entityId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.Delete,
        );
    }
}
