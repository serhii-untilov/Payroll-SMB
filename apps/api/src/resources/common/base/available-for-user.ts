import { AccessService } from '@/resources';
import { Action, Resource } from '@/types';

export abstract class AvailableForUser {
    abstract readonly userRoleResource: Resource;
    accessService: AccessService;

    constructor(accessService: AccessService) {
        this.accessService = accessService;
    }

    async availableCreateOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.userRoleResource, Action.Create);
    }

    async availableFindAllOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.userRoleResource, Action.Read);
    }

    async availableFindOneOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.userRoleResource, Action.Read);
    }

    async availableUpdateOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.userRoleResource, Action.Update);
    }

    async availableDeleteOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.userRoleResource, Action.Delete);
    }
}
