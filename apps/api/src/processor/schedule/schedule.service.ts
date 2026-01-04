import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { RoleType } from '@/types';
import { CompanyService, UserRoleService } from '@/resources';

@Injectable()
export class ScheduleService {
    private _logger: Logger = new Logger(ScheduleService.name);

    constructor(
        @Inject(forwardRef(() => SchedulerRegistry))
        private schedulerRegistry: SchedulerRegistry,
        @Inject(forwardRef(() => UserRoleService))
        private userCompaniesService: UserRoleService,
        @Inject(forwardRef(() => CompanyService))
        private companiesService: CompanyService,
    ) {}

    @Cron('0 0 2 * * *')
    async companiesCalculate() {
        this._logger.debug('Schedule event At 02:00 AM');
        const roleType = RoleType.Accountant;
        const userCompanies = await this.userCompaniesService.findAllByRoleType({ roleType });
        userCompanies.forEach(({ userId, companyId }) => this.companiesService.calculatePayroll(userId, companyId));
    }
}
