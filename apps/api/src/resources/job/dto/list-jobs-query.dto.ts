import { PaginatedQuery } from '@/resources/common/queries/paginated.query';
import { JobSearchDto } from './job-search.dto';

export class ListJobsQueryDto extends PaginatedQuery<JobSearchDto, undefined> {}
