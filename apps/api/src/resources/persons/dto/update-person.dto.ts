import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './create-person.dto';
import { IUpdatePerson } from '@repo/shared';

export class UpdatePersonDto extends PartialType(CreatePersonDto) implements IUpdatePerson {}
