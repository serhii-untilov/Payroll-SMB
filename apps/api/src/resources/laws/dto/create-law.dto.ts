import { ICreateLaw } from '@repo/shared';

export class CreateLawDto implements ICreateLaw {
    name: string;
    type: string;
}
