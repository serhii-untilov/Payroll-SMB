import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class PublicUserDataDto extends PartialType(OmitType(User, ['password', 'refreshToken'])) {}
