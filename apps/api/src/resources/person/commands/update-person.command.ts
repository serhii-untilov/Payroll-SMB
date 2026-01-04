import { UpdatePersonDto } from './dto/update-person.dto';

export class UpdatePersonCommand {
    constructor(
        public readonly userId: string,
        public readonly personId: string,
        public readonly version: number,
        public readonly payload: UpdatePersonDto,
    ) {}
}
