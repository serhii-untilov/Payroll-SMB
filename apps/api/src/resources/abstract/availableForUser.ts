import { AccessType, ResourceType } from '@/types';
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
            AccessType.CREATE,
        );
    }

    async availableFindAllOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableFindOneOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableUpdateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
    }

    async availableDeleteOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
    }
}
