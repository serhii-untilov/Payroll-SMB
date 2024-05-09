import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './create-person.dto';
import { IFindPerson } from '@repo/shared';

export class FindPersonDto extends PartialType(CreatePersonDto) implements IFindPerson {}
