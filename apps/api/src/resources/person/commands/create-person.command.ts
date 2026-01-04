import { CreatePersonDto } from './dto/create-person.dto';

export class CreatePersonCommand {
    constructor(
        public readonly userId: string,
        public readonly payload: CreatePersonDto,
    ) {}
}
