import { ICreateAccounting } from '@repo/shared';

export class CreateAccountingDto implements ICreateAccounting {
    name: string;
}
