import { Action, Resource } from '../../types';
import { AccessService } from '../access/access.service';

export abstract class AvailableForUser {
    abstract readonly resource: Resource;
    accessService: AccessService;

    constructor(accessService: AccessService) {
        this.accessService = accessService;
    }

    async availableCreateOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Create);
    }

    async availableFindAllOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Read);
    }

    async availableFindOneOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Read);
    }

    async availableUpdateOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Update);
    }

    async availableDeleteOrFail(userId: string) {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Delete);
    }
}
