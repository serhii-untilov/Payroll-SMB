import { AccessType, ResourceType } from './../../types';
import { AccessService } from '../access/access.service';

export abstract class AvailableForUser {
    abstract readonly resourceType: ResourceType;
    accessService: AccessService;

    constructor(accessService: AccessService) {
        this.accessService = accessService;
    }

    async availableCreateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Create,
        );
    }

    async availableFindAllOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Access,
        );
    }

    async availableFindOneOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Access,
        );
    }

    async availableUpdateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Update,
        );
    }

    async availableDeleteOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Delete,
        );
    }
}
