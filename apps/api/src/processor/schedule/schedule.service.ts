import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { RoleType } from '@/types';
import { CompanyService, UserRoleService, UserService } from '@/resources';

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
        @Inject(forwardRef(() => UserService))
        private usersService: UserService,
    ) {}

    @Cron('0 0 2 * * *')
    async companiesCalculate() {
        this._logger.debug('Schedule event At 02:00 AM');
        const systemUserId = await this.usersService.getSystemUserId();
        const userCompanies = await this.userCompaniesService.findAllByRoleType(systemUserId, RoleType.Accountant);
        userCompanies.forEach(({ companyId }) => this.companiesService.calculatePayroll(systemUserId, companyId));
    }
}
