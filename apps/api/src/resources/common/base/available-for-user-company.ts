import { AccessService } from '@/resources';
import { Action, Resource } from '@/types';

export abstract class AvailableForUserCompany {
    abstract readonly resource: Resource;
    accessService: AccessService;

    constructor(accessService: AccessService) {
        this.accessService = accessService;
    }

    // For update and delete methods
    abstract getCompanyId(entityId: string): Promise<string>;
    // { return (await this.repository.findOneOrFail({ where: { id: entityId } })).companyId; }

    async availableFindAllOrFail(userId: string, companyId: string) {
        await this.accessService.availableForUserCompanyOrFail(userId, companyId, this.resource, Action.Read);
    }

    async availableFindOneOrFail(userId: string, companyId: string) {
        await this.accessService.availableForUserCompanyOrFail(userId, companyId, this.resource, Action.Read);
    }

    async availableCreateOrFail(userId: string, companyId: string) {
        await this.accessService.availableForUserCompanyOrFail(userId, companyId, this.resource, Action.Create);
    }

    async availableUpdateOrFail(userId: string, entityId: string) {
        const companyId = await this.getCompanyId(entityId);
        await this.accessService.availableForUserCompanyOrFail(userId, companyId, this.resource, Action.Update);
    }

    async availableDeleteOrFail(userId: string, entityId: string) {
        const companyId = await this.getCompanyId(entityId);
        await this.accessService.availableForUserCompanyOrFail(userId, companyId, this.resource, Action.Delete);
    }
}
