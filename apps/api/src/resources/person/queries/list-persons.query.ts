import { ListPersonsQueryDto } from './dto/list-persons-query.dto';

export class ListPersonsQuery {
    constructor(
        public userId: string,
        public query: ListPersonsQueryDto,
    ) {}
}
