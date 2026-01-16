import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { JobListItemDto } from './job-list-item.dto';

export class ListJobsDto extends ListResponseDto<JobListItemDto> {}
