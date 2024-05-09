import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IUpdateUser } from '@repo/shared';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(OmitType(User, ['id'])) implements IUpdateUser {}
