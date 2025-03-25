import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { RoleType } from '@/types';
import { CompaniesService, UserCompaniesService } from '@/resources';

@Injectable()
export class ScheduleService {
    private _logger: Logger = new Logger(ScheduleService.name);

    constructor(
        @Inject(forwardRef(() => SchedulerRegistry))
        private schedulerRegistry: SchedulerRegistry,
        @Inject(forwardRef(() => UserCompaniesService))
        private userCompaniesService: UserCompaniesService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
    ) {}

    @Cron('0 0 2 * * *')
    async companiesCalculate() {
        this._logger.debug('Schedule event At 02:00 AM');
        const roleType = RoleType.Employer;
        const userCompanies = await this.userCompaniesService.findAllByRoleType({ roleType });
        userCompanies.forEach(({ userId, companyId }) =>
            this.companiesService.calculatePayroll(userId, companyId),
        );
    }
}
