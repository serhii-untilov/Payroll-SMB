/* eslint-disable */
export default async () => {
    const t = {
        ['./types/lib/accounting-type']: await import('./types/lib/accounting-type'),
        ['./resources/companies/entities/company.entity']: await import(
            './resources/companies/entities/company.entity'
        ),
        ['./resources/departments/entities/department.entity']: await import(
            './resources/departments/entities/department.entity'
        ),
        ['./types/lib/sex']: await import('./types/lib/gender'),
        ['./resources/positions/entities/position.entity']: await import(
            './resources/positions/entities/position.entity'
        ),
        ['./types/lib/payment-part']: await import('./types/lib/payment-part'),
        ['./types/lib/payment-group']: await import('./types/lib/payment-group'),
        ['./types/lib/calc-method']: await import('./types/lib/calc-method'),
        ['./resources/work-time-norm/entities/work-time-norm.entity']: await import(
            './resources/work-time-norm/entities/work-time-norm.entity'
        ),
        ['./types/lib/work-time-norm-type']: await import('./types/lib/work-time-norm-type'),
        ['./resources/work-time-norm/entities/work-time-norm-day.entity']: await import(
            './resources/work-time-norm/entities/work-time-norm-day.entity'
        ),
        ['./resources/jobs/entities/job.entity']: await import('./resources/jobs/entities/job.entity'),
        ['./resources/payment-types/entities/payment-type.entity']: await import(
            './resources/payment-types/entities/payment-type.entity'
        ),
        ['./resources/persons/entities/person.entity']: await import('./resources/persons/entities/person.entity'),
        ['./resources/position-history/entities/position-history.entity']: await import(
            './resources/position-history/entities/position-history.entity'
        ),
        ['./resources/positions/entities/position-balance.entity']: await import(
            './resources/positions/entities/position-balance.entity'
        ),
        ['./resources/laws/entities/law.entity']: await import('./resources/laws/entities/law.entity'),
        ['./resources/accounting/entities/accounting.entity']: await import(
            './resources/accounting/entities/accounting.entity'
        ),
        ['./types/lib/payment-schedule']: await import('./types/lib/payment-schedule'),
        ['./resources/user-companies/entities/user-company.entity']: await import(
            './resources/user-role/entities/user-role.entity'
        ),
        ['./types/lib/role-type']: await import('./types/lib/role-type'),
        ['./resources/roles/entities/role.entity']: await import('./resources/roles/entities/role.entity'),
        ['./resources/users/entities/user.entity']: await import('./resources/users/entities/user.entity'),
        ['./types/lib/resource']: await import('./types/lib/resource'),
        ['./types/lib/action']: await import('./types/lib/action'),
        ['./resources/pay-periods/entities/pay-period-summary.entity']: await import(
            './resources/pay-periods/entities/pay-period-summary.entity'
        ),
        ['./resources/pay-periods/entities/pay-period.entity']: await import(
            './resources/pay-periods/entities/pay-period.entity'
        ),
        ['./types/lib/record-flag']: await import('./types/lib/record-flag'),
        ['./types/lib/fixed-flag']: await import('./types/lib/fixed-flag'),
        ['./types/lib/pay-fund-group']: await import('./types/lib/pay-fund-group'),
        ['./types/lib/pay-fund-calc-method']: await import('./types/lib/pay-fund-calc-method'),
        ['./resources/pay-fund-types/entities/pay-fund-type.entity']: await import(
            './resources/pay-fund-types/entities/pay-fund-type.entity'
        ),
        ['./types/lib/pay-fund-category']: await import('./types/lib/pay-fund-category'),
        ['./types/lib/payment-status']: await import('./types/lib/payment-status'),
        ['./resources/payment-positions/entities/paymentPosition.entity']: await import(
            './resources/payment-positions/entities/paymentPosition.entity'
        ),
        ['./resources/payments/entities/payment.entity']: await import('./resources/payments/entities/payment.entity'),
        ['./types/lib/task-type']: await import('./types/lib/task-type'),
        ['./types/lib/task-status']: await import('./types/lib/task-status'),
        ['./resources/positions/dto/calc-method-balance.dto']: await import(
            './resources/positions/dto/calc-method-balance.dto'
        ),
        ['./resources/access/entities/access.entity']: await import('./resources/access/entities/access.entity'),
        ['./processor/server-sent-events/lib/MessageEvent']: await import(
            './processor/server-sent-events/lib/MessageEvent'
        ),
        ['./resources/users/dto/public-user-date.dto']: await import('./resources/users/dto/public-user-data.dto'),
        ['./resources/min-wage/entities/min-wage.entity']: await import(
            './resources/min-wage/entities/min-wage.entity'
        ),
        ['./resources/pay-funds/entities/pay-fund.entity']: await import(
            './resources/pay-funds/entities/pay-fund.entity'
        ),
        ['./resources/payrolls/entities/payroll.entity']: await import('./resources/payrolls/entities/payroll.entity'),
        ['./resources/positions/dto/position-balance-extended.dto']: await import(
            './resources/positions/dto/position-balance-extended.dto'
        ),
        ['./resources/tasks/entities/task.entity']: await import('./resources/tasks/entities/task.entity'),
        ['./auth/dto/tokens.dto']: await import('./auth/dto/tokens.dto'),
        ['./auth/dto/auth.dto']: await import('./auth/dto/auth.dto'),
    };
    return {
        '@nestjs/swagger': {
            models: [
                [
                    import('./resources/common/base/snowflake.abstract'),
                    { SnowflakeBase: { id: { required: true, type: () => String } } },
                ],
                [
                    import('./resources/common/base/base-entity.abstract'),
                    {
                        BaseEntity: {
                            createdDate: { required: true, type: () => Date },
                            createdUserId: { required: false, type: () => String, nullable: true },
                            updatedDate: { required: true, type: () => Date },
                            updatedUserId: { required: false, type: () => String, nullable: true },
                            deletedDate: { required: false, type: () => Date, nullable: true },
                            deletedUserId: { required: false, type: () => String, nullable: true },
                            version: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/accounting/entities/accounting.entity'),
                    {
                        Accounting: {
                            name: { required: true, type: () => String },
                            type: { required: true, enum: t['./types/lib/accounting-type'].AccountingType },
                        },
                    },
                ],
                [
                    import('./resources/departments/entities/department.entity'),
                    {
                        Department: {
                            name: { required: true, type: () => String },
                            company: {
                                required: false,
                                type: () => t['./resources/companies/entities/company.entity'].Company,
                            },
                            companyId: { required: true, type: () => String },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            parentDepartment: {
                                required: false,
                                type: () => t['./resources/departments/entities/department.entity'].Department,
                                nullable: true,
                            },
                            parentDepartmentId: { required: false, type: () => String, nullable: true },
                            childDepartments: {
                                required: false,
                                type: () => [t['./resources/departments/entities/department.entity'].Department],
                            },
                        },
                    },
                ],
                [
                    import('./resources/laws/entities/law.entity'),
                    {
                        Law: {
                            id: { required: true, type: () => String },
                            name: { required: true, type: () => String },
                            type: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./resources/persons/entities/person.entity'),
                    {
                        Person: {
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            middleName: { required: true, type: () => String },
                            fullName: { required: true, type: () => String },
                            birthday: { required: true, type: () => Date, nullable: true },
                            taxId: { required: true, type: () => String },
                            sex: { required: true, nullable: true, enum: t['./types/lib/sex'].Gender },
                            phone: { required: true, type: () => String },
                            email: { required: true, type: () => String },
                            photo: { required: true, type: () => String },
                            positions: {
                                required: false,
                                type: () => [t['./resources/positions/entities/position.entity'].Position],
                            },
                        },
                    },
                ],
                [
                    import('./resources/jobs/entities/job.entity'),
                    { Job: { name: { required: true, type: () => String } } },
                ],
                [
                    import('./resources/payment-types/entities/payment-type.entity'),
                    {
                        PaymentType: {
                            name: { required: true, type: () => String },
                            paymentPart: { required: true, enum: t['./types/lib/payment-part'].PaymentPart },
                            paymentGroup: { required: true, enum: t['./types/lib/payment-group'].PaymentGroup },
                            calcMethod: { required: true, enum: t['./types/lib/calc-method'].CalcMethod },
                            description: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./resources/work-time-norm/entities/work-time-norm-day.entity'),
                    {
                        WorkTimeNormDay: {
                            workTimeNorm: {
                                required: false,
                                type: () => t['./resources/work-time-norm/entities/work-time-norm.entity'].WorkTimeNorm,
                            },
                            workTimeNormId: { required: true, type: () => String },
                            day: { required: true, type: () => Number },
                            hours: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/work-time-norm/entities/work-time-norm.entity'),
                    {
                        WorkTimeNorm: {
                            code: { required: true, type: () => String },
                            name: { required: true, type: () => String },
                            description: { required: true, type: () => String },
                            type: { required: true, enum: t['./types/lib/work-time-norm-type'].WorkTimeNormType },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            applyHolidays: { required: true, type: () => Boolean },
                            applyShortenedDays: { required: true, type: () => Boolean },
                            applyMovedDays: { required: true, type: () => Boolean },
                            applyPhases: { required: true, type: () => Boolean },
                            applyRate: { required: true, type: () => Boolean },
                            days: {
                                required: false,
                                type: () => [
                                    t['./resources/work-time-norm/entities/work-time-norm-day.entity'].WorkTimeNormDay,
                                ],
                            },
                        },
                    },
                ],
                [
                    import('./resources/position-history/entities/position-history.entity'),
                    {
                        PositionHistory: {
                            position: {
                                required: false,
                                type: () => t['./resources/positions/entities/position.entity'].Position,
                            },
                            positionId: { required: true, type: () => String },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            department: {
                                required: false,
                                type: () => t['./resources/departments/entities/department.entity'].Department,
                            },
                            departmentId: { required: true, type: () => String, nullable: true },
                            job: { required: false, type: () => t['./resources/jobs/entities/job.entity'].Job },
                            jobId: { required: true, type: () => String, nullable: true },
                            workTimeNorm: {
                                required: false,
                                type: () => t['./resources/work-time-norm/entities/work-time-norm.entity'].WorkTimeNorm,
                            },
                            workTimeNormId: { required: true, type: () => String, nullable: true },
                            paymentType: {
                                required: false,
                                type: () => t['./resources/payment-types/entities/payment-type.entity'].PaymentType,
                            },
                            paymentTypeId: { required: true, type: () => String, nullable: true },
                            wage: { required: true, type: () => Number },
                            rate: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/positions/entities/position-balance.entity'),
                    {
                        PositionBalance: {
                            id: { required: true, type: () => String },
                            position: {
                                required: false,
                                type: () => t['./resources/positions/entities/position.entity'].Position,
                            },
                            positionId: { required: true, type: () => String },
                            payPeriod: { required: true, type: () => Date },
                            inBalance: { required: false, type: () => Number },
                            planDays: { required: true, type: () => Number },
                            planHours: { required: true, type: () => Number },
                            factDays: { required: true, type: () => Number },
                            factHours: { required: true, type: () => Number },
                            accruals: { required: true, type: () => Number },
                            deductions: { required: true, type: () => Number },
                            basic: { required: true, type: () => Number },
                            adjustments: { required: true, type: () => Number },
                            bonuses: { required: true, type: () => Number },
                            vacations: { required: true, type: () => Number },
                            sicks: { required: true, type: () => Number },
                            refunds: { required: true, type: () => Number },
                            otherAccruals: { required: true, type: () => Number },
                            taxes: { required: true, type: () => Number },
                            payments: { required: true, type: () => Number },
                            otherDeductions: { required: true, type: () => Number },
                            outBalance: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/positions/entities/position.entity'),
                    {
                        Position: {
                            company: {
                                required: false,
                                type: () => t['./resources/companies/entities/company.entity'].Company,
                            },
                            companyId: { required: true, type: () => String },
                            cardNumber: { required: true, type: () => String },
                            sequenceNumber: { required: true, type: () => Number },
                            description: { required: true, type: () => String },
                            person: {
                                required: false,
                                type: () => t['./resources/persons/entities/person.entity'].Person,
                            },
                            personId: { required: true, type: () => String, nullable: true },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            history: {
                                required: false,
                                type: () => [
                                    t['./resources/position-history/entities/position-history.entity'].PositionHistory,
                                ],
                            },
                            balance: {
                                required: false,
                                type: () => [
                                    t['./resources/positions/entities/position-balance.entity'].PositionBalance,
                                ],
                            },
                        },
                    },
                ],
                [
                    import('./resources/companies/entities/company.entity'),
                    {
                        Company: {
                            name: { required: true, type: () => String },
                            taxId: { required: true, type: () => String },
                            law: { required: false, type: () => t['./resources/laws/entities/law.entity'].Law },
                            lawId: { required: true, type: () => String },
                            accounting: {
                                required: false,
                                type: () => t['./resources/accounting/entities/accounting.entity'].Accounting,
                            },
                            accountingId: { required: true, type: () => String },
                            paymentSchedule: {
                                required: true,
                                enum: t['./types/lib/payment-schedule'].PaymentSchedule,
                            },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            payPeriod: { required: true, type: () => Date },
                            checkDate: { required: true, type: () => Date },
                            departments: {
                                required: false,
                                type: () => [t['./resources/departments/entities/department.entity'].Department],
                            },
                            positions: {
                                required: false,
                                type: () => [t['./resources/positions/entities/position.entity'].Position],
                            },
                            users: {
                                required: false,
                                type: () => [t['./resources/user-companies/entities/user-company.entity'].UserRole],
                            },
                        },
                    },
                ],
                [
                    import('./resources/roles/entities/role.entity'),
                    {
                        Role: {
                            name: { required: true, type: () => String },
                            type: { required: true, enum: t['./types/lib/role-type'].RoleType },
                        },
                    },
                ],
                [
                    import('./resources/users/entities/user.entity'),
                    {
                        User: {
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            email: { required: true, type: () => String },
                            password: { required: true, type: () => String },
                            refreshToken: { required: true, type: () => String, nullable: true },
                            isActive: { required: true, type: () => Boolean },
                            language: { required: true, type: () => String, nullable: true },
                            role: { required: false, type: () => t['./resources/roles/entities/role.entity'].Role },
                            roleId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./resources/user-role/entities/user-role.entity'),
                    {
                        UserCompany: {
                            user: { required: false, type: () => t['./resources/users/entities/user.entity'].User },
                            userId: { required: true, type: () => String },
                            company: {
                                required: false,
                                type: () => t['./resources/companies/entities/company.entity'].Company,
                            },
                            companyId: { required: true, type: () => String },
                            role: { required: false, type: () => t['./resources/roles/entities/role.entity'].Role },
                            roleId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./resources/access/entities/access.entity'),
                    {
                        Access: {
                            roleType: { required: true, enum: t['./types/lib/role-type'].RoleType },
                            resource: { required: true, enum: t['./types/lib/resource'].Resource },
                            action: { required: true, enum: t['./types/lib/action'].Action },
                        },
                    },
                ],
                [import('./resources/access/dto/create-access.dto'), { CreateAccessDto: {} }],
                [import('./resources/access/dto/available-access.dto'), { AvailableAccessDto: {} }],
                [
                    import('./resources/access/dto/available-access-user.dto'),
                    { AvailableAccessUserDto: { userId: { required: true, type: () => String } } },
                ],
                [
                    import('./resources/access/dto/available-access-user-company.dto'),
                    {
                        AvailableAccessUserCompanyDto: {
                            userId: { required: true, type: () => String },
                            companyId: { required: true, type: () => String },
                        },
                    },
                ],
                [import('./resources/access/dto/update-access.dto'), { UpdateAccessDto: {} }],
                [
                    import('./resources/user-role/dto/create-user-role.dto'),
                    {
                        CreateUserCompanyDto: {
                            userId: { required: true, type: () => String },
                            companyId: { required: true, type: () => String },
                            roleId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./resources/user-role/dto/find-all-user-role.dto'),
                    {
                        FindAllUserCompanyDto: {
                            userId: { required: true, type: () => String },
                            relations: { required: false, type: () => Boolean, default: false },
                            withDeleted: { required: false, type: () => Boolean, default: false },
                        },
                    },
                ],
                [
                    import('./resources/user-role/dto/find-one-user-company.dto'),
                    {
                        FindOneUserCompanyDto: {
                            relations: { required: false, type: () => Boolean },
                            withDeleted: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [import('./resources/user-role/dto/update-user-role.dto'), { UpdateUserCompanyDto: {} }],
                [
                    import('./resources/user-role/dto/find-user-role.dto'),
                    {
                        FindUserCompanyByRoleTypeDto: {
                            roleType: { required: true, enum: t['./types/lib/role-type'].RoleType },
                            relations: { required: false, type: () => Boolean, default: false },
                            withDeleted: { required: false, type: () => Boolean, default: false },
                        },
                    },
                ],
                [import('./resources/roles/dto/create-role.dto'), { CreateRoleDto: {} }],
                [import('./resources/roles/dto/update-role.dto'), { UpdateRoleDto: {} }],
                [
                    import('./resources/users/dto/create-user.dto'),
                    {
                        CreateUserDto: {
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            email: { required: true, type: () => String },
                            password: { required: true, type: () => String },
                            roleId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./resources/users/dto/find-one-user.dto'),
                    { FindOneUserDto: { relations: { required: false, type: () => Boolean } } },
                ],
                [import('./resources/users/dto/public-user-data.dto'), { PublicUserDataDto: {} }],
                [import('./resources/users/dto/update-user.dto'), { UpdateUserDto: {} }],
                [import('./resources/companies/dto/create-company.dto'), { CreateCompanyDto: {} }],
                [import('./resources/companies/dto/update-company.dto'), { UpdateCompanyDto: {} }],
                [
                    import('./resources/pay-periods/entities/pay-period.entity'),
                    {
                        PayPeriod: {
                            company: {
                                required: false,
                                type: () => t['./resources/companies/entities/company.entity'].Company,
                            },
                            companyId: { required: true, type: () => String },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            state: { required: true, type: () => String },
                            inBalance: { required: true, type: () => Number },
                            inCompanyDebt: { required: true, type: () => Number },
                            inEmployeeDebt: { required: true, type: () => Number },
                            accruals: { required: true, type: () => Number },
                            deductions: { required: true, type: () => Number },
                            basic: { required: true, type: () => Number },
                            adjustments: { required: true, type: () => Number },
                            bonuses: { required: true, type: () => Number },
                            vacations: { required: true, type: () => Number },
                            sicks: { required: true, type: () => Number },
                            refunds: { required: true, type: () => Number },
                            otherAccruals: { required: true, type: () => Number },
                            taxes: { required: true, type: () => Number },
                            payments: { required: true, type: () => Number },
                            otherDeductions: { required: true, type: () => Number },
                            outBalance: { required: true, type: () => Number },
                            outCompanyDebt: { required: true, type: () => Number },
                            outEmployeeDebt: { required: true, type: () => Number },
                            funds: { required: true, type: () => Number },
                            calcMethods: {
                                required: false,
                                type: () => [
                                    t['./resources/pay-periods/entities/pay-period-summary.entity'].PayPeriodSummary,
                                ],
                            },
                        },
                    },
                ],
                [
                    import('./resources/pay-periods/entities/pay-period-summary.entity'),
                    {
                        PayPeriodSummary: {
                            id: { required: true, type: () => String },
                            payPeriod: {
                                required: false,
                                type: () => t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod,
                            },
                            payPeriodId: { required: true, type: () => String },
                            calcMethod: { required: true, enum: t['./types/lib/calc-method'].CalcMethod },
                            factSum: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/payrolls/entities/payroll.entity'),
                    {
                        Payroll: {
                            position: {
                                required: false,
                                type: () => t['./resources/positions/entities/position.entity'].Position,
                            },
                            positionId: { required: true, type: () => String },
                            payPeriod: { required: true, type: () => Date },
                            accPeriod: { required: true, type: () => Date },
                            paymentType: {
                                required: false,
                                type: () => t['./resources/payment-types/entities/payment-type.entity'].PaymentType,
                            },
                            paymentTypeId: { required: true, type: () => String },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            sourceType: { required: true, enum: t['./types/lib/resource'].Resource },
                            sourceId: { required: true, type: () => String, nullable: true },
                            dateBegin: { required: true, type: () => Date, nullable: true },
                            dateEnd: { required: true, type: () => Date, nullable: true },
                            planDays: { required: true, type: () => Number },
                            planHours: { required: true, type: () => Number },
                            planSum: { required: true, type: () => Number },
                            rate: { required: true, type: () => Number },
                            factDays: { required: true, type: () => Number },
                            factHours: { required: true, type: () => Number },
                            factSum: { required: true, type: () => Number },
                            mask1: { required: true, type: () => Number },
                            mask2: { required: true, type: () => Number },
                            recordFlags: { required: true, enum: t['./types/lib/record-flag'].RecordFlag },
                            fixedFlags: { required: true, enum: t['./types/lib/fixed-flag'].FixedFlag },
                            planHoursByDay: { required: true, type: () => Object, nullable: true },
                            factHoursByDay: { required: true, type: () => Object, nullable: true },
                            parentId: { required: true, type: () => String, nullable: true },
                        },
                    },
                ],
                [
                    import('./resources/pay-fund-types/entities/pay-fund-type.entity'),
                    {
                        PayFundType: {
                            name: { required: true, type: () => String },
                            group: { required: true, enum: t['./types/lib/pay-fund-group'].PayFundGroup },
                            calcMethod: {
                                required: true,
                                enum: t['./types/lib/pay-fund-calc-method'].PayFundCalcMethod,
                            },
                            sequence: { required: true, type: () => Number },
                            description: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./resources/pay-funds/entities/pay-fund.entity'),
                    {
                        PayFund: {
                            id: { required: true, type: () => String },
                            position: {
                                required: false,
                                type: () => t['./resources/positions/entities/position.entity'].Position,
                            },
                            positionId: { required: true, type: () => String },
                            payPeriod: { required: true, type: () => Date },
                            accPeriod: { required: true, type: () => Date },
                            payFundType: {
                                required: false,
                                type: () => t['./resources/pay-fund-types/entities/pay-fund-type.entity'].PayFundType,
                            },
                            payFundTypeId: { required: true, type: () => String },
                            payFundCategory: {
                                required: true,
                                enum: t['./types/lib/pay-fund-category'].PayFundCategory,
                            },
                            incomeSum: { required: true, type: () => Number },
                            baseSum: { required: true, type: () => Number },
                            rate: { required: true, type: () => Number },
                            paySum: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/min-wage/entities/min-wage.entity'),
                    {
                        MinWage: {
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            paySum: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/payments/entities/payment.entity'),
                    {
                        Payment: {
                            company: {
                                required: false,
                                type: () => t['./resources/companies/entities/company.entity'].Company,
                            },
                            companyId: { required: true, type: () => String },
                            payPeriod: { required: true, type: () => Date },
                            accPeriod: { required: true, type: () => Date },
                            docNumber: { required: true, type: () => String },
                            docDate: { required: true, type: () => Date },
                            paymentType: {
                                required: false,
                                type: () => t['./resources/payment-types/entities/payment-type.entity'].PaymentType,
                            },
                            paymentTypeId: { required: true, type: () => String },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            baseSum: { required: true, type: () => Number },
                            deductions: { required: true, type: () => Number },
                            paySum: { required: true, type: () => Number },
                            funds: { required: true, type: () => Number },
                            status: { required: true, enum: t['./types/lib/payment-status'].PaymentStatus },
                            recordFlags: { required: true, enum: t['./types/lib/record-flag'].RecordFlag },
                            description: { required: true, type: () => String },
                            paymentPositions: {
                                required: false,
                                type: () => [
                                    t['./resources/payment-positions/entities/paymentPosition.entity'].PaymentPosition,
                                ],
                            },
                        },
                    },
                ],
                [
                    import('./resources/payment-positions/entities/paymentPosition.entity'),
                    {
                        PaymentPosition: {
                            payment: {
                                required: false,
                                type: () => t['./resources/payments/entities/payment.entity'].Payment,
                            },
                            paymentId: { required: true, type: () => String },
                            position: {
                                required: false,
                                type: () => t['./resources/positions/entities/position.entity'].Position,
                            },
                            positionId: { required: true, type: () => String },
                            baseSum: { required: true, type: () => Number },
                            deductions: { required: true, type: () => Number },
                            paySum: { required: true, type: () => Number },
                            funds: { required: true, type: () => Number },
                            recordFlags: { required: true, enum: t['./types/lib/record-flag'].RecordFlag },
                        },
                    },
                ],
                [
                    import('./resources/tasks/entities/task.entity'),
                    {
                        Task: {
                            company: {
                                required: false,
                                type: () => t['./resources/companies/entities/company.entity'].Company,
                            },
                            companyId: { required: true, type: () => String },
                            type: { required: true, enum: t['./types/lib/task-type'].TaskType },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            sequenceNumber: { required: true, type: () => Number },
                            status: { required: true, enum: t['./types/lib/task-status'].TaskStatus },
                            entityId: { required: true, type: () => String, nullable: true },
                        },
                    },
                ],
                [import('./resources/departments/dto/create-department.dto'), { CreateDepartmentDto: {} }],
                [
                    import('./resources/departments/dto/find-all-department.dto'),
                    { FindAllDepartmentDto: { relations: { required: false, type: () => Boolean } } },
                ],
                [
                    import('./resources/departments/dto/find-one-department.dto'),
                    { FindOneDepartmentDto: { relations: { required: false, type: () => Boolean } } },
                ],
                [import('./resources/departments/dto/update-department.dto'), { UpdateDepartmentDto: {} }],
                [
                    import('./resources/jobs/dto/create-job.dto'),
                    { CreateJobDto: { name: { required: true, type: () => String } } },
                ],
                [import('./resources/jobs/dto/update-job.dto'), { UpdateJobDto: {} }],
                [
                    import('./resources/min-wage/dto/create-min-wage.dto'),
                    {
                        CreateMinWageDto: {
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            paySum: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/min-wage/dto/update-min-wage.dto'),
                    { UpdateMinWageDto: { version: { required: true, type: () => Number } } },
                ],
                [import('./resources/pay-fund-types/dto/create-pay-fund-type.dto'), { CreatePayFundTypeDto: {} }],
                [import('./resources/pay-fund-types/dto/update-pay-fund-type.dto'), { UpdatePayFundTypeDto: {} }],
                [import('./resources/pay-funds/dto/create-pay-fund.dto'), { CreatePayFundDto: {} }],
                [
                    import('./resources/pay-funds/dto/find-pay-fund.dto'),
                    {
                        FindPayFundDto: {
                            companyId: { required: false, type: () => String },
                            positionId: { required: false, type: () => String },
                            payPeriod: { required: false, type: () => Date },
                            relations: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [import('./resources/pay-funds/dto/update-pay-fund.dto'), { UpdatePayFundDto: {} }],
                [
                    import('./resources/pay-periods/dto/create-pay-period.dto'),
                    {
                        CreatePayPeriodDto: {
                            companyId: { required: true, type: () => String },
                            dateFrom: { required: true, type: () => Date },
                            dateTo: { required: true, type: () => Date },
                            state: { required: true, type: () => String },
                            inBalance: { required: false, type: () => Number },
                            inCompanyDebt: { required: false, type: () => Number },
                            inEmployeeDebt: { required: false, type: () => Number },
                            accruals: { required: false, type: () => Number },
                            deductions: { required: false, type: () => Number },
                            basic: { required: false, type: () => Number },
                            adjustments: { required: false, type: () => Number },
                            bonuses: { required: false, type: () => Number },
                            vacations: { required: false, type: () => Number },
                            sicks: { required: false, type: () => Number },
                            refunds: { required: false, type: () => Number },
                            otherAccruals: { required: false, type: () => Number },
                            taxes: { required: false, type: () => Number },
                            payments: { required: false, type: () => Number },
                            otherDeductions: { required: false, type: () => Number },
                            outBalance: { required: false, type: () => Number },
                            outCompanyDebt: { required: false, type: () => Number },
                            outEmployeeDebt: { required: false, type: () => Number },
                            funds: { required: false, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/pay-periods/dto/create-pay-period-calc-method.dto'),
                    { CreatePayPeriodSummaryDto: {} },
                ],
                [
                    import('./resources/pay-periods/dto/find-all-pay-period.dto'),
                    {
                        FindAllPayPeriodDto: {
                            relations: { required: false, type: () => Boolean },
                            fullFieldList: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/pay-periods/dto/find-current-pay-period.dto'),
                    {
                        FindCurrentPayPeriodDto: {
                            relations: { required: false, type: () => Boolean },
                            fullFieldList: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/pay-periods/dto/find-one-pay-period.dto'),
                    {
                        FindOnePayPeriodDto: {
                            relations: { required: false, type: () => Boolean },
                            fullFieldList: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [import('./resources/pay-periods/dto/update-pay-period.dto'), { UpdatePayPeriodDto: {} }],
                [
                    import('./resources/pay-periods/dto/update-pay-period-calc-method.dto'),
                    { UpdatePayPeriodSummaryDto: {} },
                ],
                [import('./resources/pay-periods/dto/close-pay-period.dto'), { ClosePayPeriodDto: {} }],
                [import('./resources/pay-periods/dto/open-pay-period.dto'), { OpenPayPeriodDto: {} }],
                [import('./resources/payrolls/dto/create-payroll.dto'), { CreatePayrollDto: {} }],
                [
                    import('./resources/payrolls/dto/find-payroll.dto'),
                    {
                        FindPayrollDto: {
                            companyId: { required: false, type: () => String },
                            positionId: { required: false, type: () => String },
                            payPeriod: { required: false, type: () => Date },
                            relations: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [import('./resources/payrolls/dto/update-payroll.dto'), { UpdatePayrollDto: {} }],
                [import('./resources/positions/dto/create-position.dto'), { CreatePositionDto: {} }],
                [
                    import('./resources/positions/dto/find-all-position.dto'),
                    {
                        FindAllPositionDto: {
                            companyId: { required: true, type: () => String },
                            onDate: { required: false, type: () => Date },
                            onPayPeriodDate: { required: false, type: () => Date },
                            relations: { required: false, type: () => Boolean },
                            employeesOnly: { required: false, type: () => Boolean },
                            vacanciesOnly: { required: false, type: () => Boolean },
                            dismissedOnly: { required: false, type: () => Boolean },
                            deletedOnly: { required: false, type: () => Boolean },
                            includeDeleted: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/positions/dto/find-one-position.dto'),
                    {
                        FindOnePositionDto: {
                            onDate: { required: false, type: () => Date },
                            onPayPeriodDate: { required: false, type: () => Date },
                            relations: { required: false, type: () => Boolean },
                            withDeleted: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/positions/dto/find-position-balance.dto'),
                    {
                        FindAllPositionBalanceDto: {
                            companyId: { required: true, type: () => String },
                            payPeriod: { required: false, type: () => Date },
                        },
                    },
                ],
                [
                    import('./resources/positions/dto/find-position-by-person.dto'),
                    {
                        FindPositionByPersonDto: {
                            companyId: { required: true, type: () => String },
                            personId: { required: true, type: () => String },
                            onDate: { required: false, type: () => Date },
                            onPayPeriodDate: { required: false, type: () => Date },
                            relations: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/positions/dto/calc-method-balance.dto'),
                    {
                        CalcMethodBalanceDto: {
                            calcMethod: { required: true, type: () => String },
                            factSum: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/positions/dto/position-balance-extended.dto'),
                    {
                        PositionBalanceExtendedDto: {
                            departmentName: { required: false, type: () => String },
                            jobName: { required: false, type: () => String },
                            workTimeNormName: { required: false, type: () => String },
                            paymentTypeName: { required: false, type: () => String },
                            calcMethod: { required: false, type: () => String },
                            paySumECB: { required: false, type: () => Number },
                            calcMethodBalance: {
                                required: true,
                                type: () => [
                                    t['./resources/positions/dto/calc-method-balance.dto'].CalcMethodBalanceDto,
                                ],
                            },
                        },
                    },
                ],
                [import('./resources/positions/dto/update-position.dto'), { UpdatePositionDto: {} }],
                [
                    import('./resources/payment-positions/dto/create-payment-position.dto'),
                    { CreatePaymentPositionDto: {} },
                ],
                [
                    import('./resources/payment-positions/dto/find-all-payment-position.dto'),
                    {
                        FindAllPaymentPositionDto: {
                            paymentId: { required: true, type: () => String },
                            relations: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/payment-positions/dto/find-one-payment-position.dto'),
                    {
                        FindOnePaymentPositionDto: {
                            relations: { required: false, type: () => Boolean },
                            withDeleted: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/payment-positions/dto/update-payment-position.dto'),
                    { UpdatePaymentPositionDto: {} },
                ],
                [import('./resources/payments/dto/create-payment.dto'), { CreatePaymentDto: {} }],
                [
                    import('./resources/payments/dto/find-all-payment.dto'),
                    {
                        FindAllPaymentDto: {
                            companyId: { required: true, type: () => String },
                            positionId: { required: false, type: () => String },
                            payPeriod: { required: false, type: () => Date },
                            accPeriod: { required: false, type: () => Date },
                            paymentTypeId: { required: false, type: () => String },
                            status: { required: false, enum: t['./types/lib/payment-status'].PaymentStatus },
                            relations: { required: false, type: () => Boolean },
                            withDeleted: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/payments/dto/find-one-payment.dto'),
                    {
                        FindOnePaymentDto: {
                            relations: { required: false, type: () => Boolean },
                            withDeleted: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [import('./resources/payments/dto/process-payment.dto'), { ProcessPaymentDto: {} }],
                [import('./resources/payments/dto/update-payment.dto'), { UpdatePaymentDto: {} }],
                [import('./resources/payments/dto/withdraw-payment.dto'), { WithdrawPaymentDto: {} }],
                [
                    import('./resources/payment-deductions/dto/create-payment-deduction.dto'),
                    {
                        CreatePaymentDeductionDto: {
                            id: { required: true, type: () => String },
                            paymentPositionId: { required: true, type: () => String },
                            paymentTypeId: { required: true, type: () => String },
                            baseSum: { required: true, type: () => Number },
                            paySum: { required: true, type: () => Number },
                            recordFlags: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/payment-deductions/dto/update-payment-deduction.dto'),
                    { UpdatePaymentDeductionDto: {} },
                ],
                [
                    import('./resources/payment-deductions/entities/payment-deduction.entity'),
                    {
                        PaymentDeduction: {
                            id: { required: true, type: () => String },
                            paymentPosition: {
                                required: false,
                                type: () =>
                                    t['./resources/payment-positions/entities/paymentPosition.entity'].PaymentPosition,
                            },
                            paymentPositionId: { required: true, type: () => String },
                            paymentType: {
                                required: false,
                                type: () => t['./resources/payment-types/entities/payment-type.entity'].PaymentType,
                            },
                            paymentTypeId: { required: true, type: () => String },
                            baseSum: { required: true, type: () => Number },
                            paySum: { required: true, type: () => Number },
                            recordFlags: { required: true, enum: t['./types/lib/record-flag'].RecordFlag },
                        },
                    },
                ],
                [
                    import('./resources/payment-funds/entities/payment-fund.entity'),
                    {
                        PaymentFund: {
                            id: { required: true, type: () => String },
                            paymentPosition: {
                                required: false,
                                type: () =>
                                    t['./resources/payment-positions/entities/paymentPosition.entity'].PaymentPosition,
                            },
                            paymentPositionId: { required: true, type: () => String },
                            payFundType: {
                                required: false,
                                type: () => t['./resources/pay-fund-types/entities/pay-fund-type.entity'].PayFundType,
                            },
                            payFundTypeId: { required: true, type: () => String },
                            baseSum: { required: true, type: () => Number },
                            paySum: { required: true, type: () => Number },
                            recordFlags: { required: true, enum: t['./types/lib/record-flag'].RecordFlag },
                        },
                    },
                ],
                [
                    import('./resources/payment-funds/dto/create-payment-fund.dto'),
                    {
                        CreatePaymentFundDto: {
                            id: { required: true, type: () => String },
                            paymentPositionId: { required: true, type: () => String },
                            payFundTypeId: { required: true, type: () => String },
                            baseSum: { required: true, type: () => Number },
                            paySum: { required: true, type: () => Number },
                            recordFlags: { required: true, type: () => Number },
                        },
                    },
                ],
                [import('./resources/payment-funds/dto/update-payment-fund.dto'), { UpdatePaymentFundDto: {} }],
                [import('./resources/payment-types/dto/create-payment-type.dto'), { CreatePaymentTypeDto: {} }],
                [
                    import('./resources/payment-types/dto/find-all-payment-type.dto'),
                    {
                        FindAllPaymentTypeDto: {
                            part: { required: false, type: () => String },
                            groups: { required: false, type: () => [String] },
                            methods: { required: false, type: () => [String] },
                            ids: { required: false, type: () => [Number] },
                        },
                    },
                ],
                [import('./resources/payment-types/dto/update-payment-type.dto'), { UpdatePaymentTypeDto: {} }],
                [import('./resources/persons/dto/create-person.dto'), { CreatePersonDto: {} }],
                [import('./resources/persons/dto/update-person.dto'), { UpdatePersonDto: {} }],
                [import('./resources/persons/dto/find-all-person.dto'), { FindAllPersonDto: {} }],
                [
                    import('./resources/position-history/dto/create-position-history.dto'),
                    { CreatePositionHistoryDto: {} },
                ],
                [
                    import('./resources/position-history/dto/find-all-position-history.dto'),
                    {
                        FindAllPositionHistoryDto: {
                            onDate: { required: false, type: () => Date },
                            onPayPeriodDate: { required: false, type: () => Date },
                            last: { required: false, type: () => Boolean },
                            relations: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/position-history/dto/find-one-position-history.dto'),
                    { FindOnePositionHistoryDto: { relations: { required: false, type: () => Boolean } } },
                ],
                [
                    import('./resources/position-history/dto/update-position-history.dto'),
                    { UpdatePositionHistoryDto: {} },
                ],
                [import('./resources/tasks/dto/create-task.dto'), { CreateTaskDto: {} }],
                [
                    import('./resources/tasks/dto/find-all-task.dto'),
                    {
                        FindAllTaskDto: {
                            companyId: { required: false, type: () => String },
                            onDate: { required: false, type: () => Date },
                            onPayPeriodDate: { required: false, type: () => Date },
                            relations: { required: false, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./resources/tasks/dto/find-one-task.dto'),
                    { FindOneTaskDto: { relations: { required: false, type: () => Boolean } } },
                ],
                [import('./resources/tasks/dto/update-task.dto'), { UpdateTaskDto: {} }],
                [import('./resources/work-time-norm/dto/create-work-time-norm.dto'), { CreateWorkTimeNormDto: {} }],
                [
                    import('./resources/work-time-norm/dto/find-work-time-norm.dto'),
                    { FindWorkTimeNormDto: { relations: { required: false, type: () => Boolean } } },
                ],
                [import('./resources/work-time-norm/dto/update-work-time-norm.dto'), { UpdateWorkTimeNormDto: {} }],
                [
                    import('./auth/dto/auth.dto'),
                    {
                        AuthDto: {
                            email: { required: true, type: () => String },
                            password: { required: true, type: () => String },
                            rememberMe: { required: true, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./auth/dto/tokens.dto'),
                    {
                        TokensDto: {
                            accessToken: { required: true, type: () => String },
                            refreshToken: { required: true, type: () => String, nullable: true },
                        },
                    },
                ],
                [
                    import('./resources/accounting/dto/create-accounting.dto'),
                    {
                        CreateAccountingDto: {
                            name: { required: true, type: () => String },
                            type: { required: true, type: () => String },
                        },
                    },
                ],
                [import('./resources/accounting/dto/update-accounting.dto'), { UpdateAccountingDto: {} }],
                [
                    import('./resources/laws/dto/create-law.dto'),
                    {
                        CreateLawDto: {
                            name: { required: true, type: () => String },
                            type: { required: true, type: () => String },
                        },
                    },
                ],
                [import('./resources/laws/dto/update-law.dto'), { UpdateLawDto: {} }],
                [
                    import('./resources/work-time-norm/dto/create-work-time-norm-period.dto'),
                    {
                        CreateWorkTimeNormPeriodDto: {
                            id: { required: true, type: () => String },
                            workTimeNormId: { required: true, type: () => String },
                            day: { required: true, type: () => Number },
                            hours: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./resources/work-time-norm/dto/update-work-time-norm-period.dto'),
                    { UpdateWorkTimeNormPeriodDto: {} },
                ],
            ],
            controllers: [
                [
                    import('./resources/access/access.controller'),
                    {
                        AccessController: {
                            create: { type: t['./resources/access/entities/access.entity'].Access },
                            findAll: { type: [t['./resources/access/entities/access.entity'].Access] },
                            findOne: { type: t['./resources/access/entities/access.entity'].Access },
                            update: { type: t['./resources/access/entities/access.entity'].Access },
                            remove: { type: t['./resources/access/entities/access.entity'].Access },
                            available: { type: Boolean },
                            availableForUser: { type: Boolean },
                            availableForUserCompany: { type: Boolean },
                        },
                    },
                ],
                [
                    import('./resources/accounting/accounting.controller'),
                    {
                        AccountingController: {
                            findAll: { type: [t['./resources/accounting/entities/accounting.entity'].Accounting] },
                            findOne: { type: t['./resources/accounting/entities/accounting.entity'].Accounting },
                        },
                    },
                ],
                [
                    import('./resources/companies/companies.controller'),
                    {
                        CompaniesController: {
                            create: { type: t['./resources/companies/entities/company.entity'].Company },
                            findAll: { type: [t['./resources/companies/entities/company.entity'].Company] },
                            findLast: { type: t['./resources/companies/entities/company.entity'].Company },
                            findOne: { type: t['./resources/companies/entities/company.entity'].Company },
                            update: { type: t['./resources/companies/entities/company.entity'].Company },
                            remove: { type: t['./resources/companies/entities/company.entity'].Company },
                            salaryCalculate: {},
                        },
                    },
                ],
                [
                    import('./processor/server-sent-events/sse.controller'),
                    {
                        SseController: {
                            getCompanyStream: {
                                type: t['./processor/server-sent-events/lib/MessageEvent'].MessageEvent,
                            },
                        },
                    },
                ],
                [
                    import('./resources/roles/roles.controller'),
                    {
                        RolesController: {
                            create: { type: t['./resources/roles/entities/role.entity'].Role },
                            findAll: { type: [t['./resources/roles/entities/role.entity'].Role] },
                            findOne: { type: t['./resources/roles/entities/role.entity'].Role },
                            update: { type: t['./resources/roles/entities/role.entity'].Role },
                            remove: { type: t['./resources/roles/entities/role.entity'].Role },
                        },
                    },
                ],
                [
                    import('./resources/users/users.controller'),
                    {
                        UsersController: {
                            create: { type: t['./resources/users/dto/public-user-date.dto'].PublicUserDataDto },
                            findAll: { type: [t['./resources/users/dto/public-user-date.dto'].PublicUserDataDto] },
                            findCurrent: { type: t['./resources/users/dto/public-user-date.dto'].PublicUserDataDto },
                            findOne: { type: t['./resources/users/dto/public-user-date.dto'].PublicUserDataDto },
                            update: { type: t['./resources/users/dto/public-user-date.dto'].PublicUserDataDto },
                            remove: { type: t['./resources/users/dto/public-user-date.dto'].PublicUserDataDto },
                        },
                    },
                ],
                [
                    import('./resources/user-role/user-role.controller'),
                    {
                        UserCompaniesController: {
                            create: { type: t['./resources/user-companies/entities/user-company.entity'].UserRole },
                            findAll: {
                                type: [t['./resources/user-companies/entities/user-company.entity'].UserRole],
                            },
                            findOne: { type: t['./resources/user-companies/entities/user-company.entity'].UserRole },
                            remove: { type: t['./resources/user-companies/entities/user-company.entity'].UserRole },
                            restore: { type: t['./resources/user-companies/entities/user-company.entity'].UserRole },
                        },
                    },
                ],
                [
                    import('./resources/departments/departments.controller'),
                    {
                        DepartmentsController: {
                            create: { type: t['./resources/departments/entities/department.entity'].Department },
                            findAll: { type: [t['./resources/departments/entities/department.entity'].Department] },
                            findOne: { type: t['./resources/departments/entities/department.entity'].Department },
                            update: { type: t['./resources/departments/entities/department.entity'].Department },
                            remove: { type: t['./resources/departments/entities/department.entity'].Department },
                        },
                    },
                ],
                [
                    import('./resources/jobs/jobs.controller'),
                    {
                        JobsController: {
                            create: { type: t['./resources/jobs/entities/job.entity'].Job },
                            findAll: { type: [t['./resources/jobs/entities/job.entity'].Job] },
                            findOne: { type: t['./resources/jobs/entities/job.entity'].Job },
                            update: { type: t['./resources/jobs/entities/job.entity'].Job },
                            remove: { type: t['./resources/jobs/entities/job.entity'].Job },
                        },
                    },
                ],
                [
                    import('./resources/laws/laws.controller'),
                    {
                        LawsController: {
                            findAll: { type: [t['./resources/laws/entities/law.entity'].Law] },
                            findOne: { type: t['./resources/laws/entities/law.entity'].Law },
                        },
                    },
                ],
                [
                    import('./resources/min-wage/min-wage.controller'),
                    {
                        MinWageController: {
                            create: { type: t['./resources/min-wage/entities/min-wage.entity'].MinWage },
                            findAll: { type: [t['./resources/min-wage/entities/min-wage.entity'].MinWage] },
                            findOne: { type: t['./resources/min-wage/entities/min-wage.entity'].MinWage },
                            update: { type: t['./resources/min-wage/entities/min-wage.entity'].MinWage },
                            remove: { type: t['./resources/min-wage/entities/min-wage.entity'].MinWage },
                        },
                    },
                ],
                [
                    import('./resources/pay-fund-types/pay-fund-types.controller'),
                    {
                        PayFundTypesController: {
                            create: { type: t['./resources/pay-fund-types/entities/pay-fund-type.entity'].PayFundType },
                            findAll: {
                                type: [t['./resources/pay-fund-types/entities/pay-fund-type.entity'].PayFundType],
                            },
                            findOne: {
                                type: t['./resources/pay-fund-types/entities/pay-fund-type.entity'].PayFundType,
                            },
                            update: { type: t['./resources/pay-fund-types/entities/pay-fund-type.entity'].PayFundType },
                            remove: { type: t['./resources/pay-fund-types/entities/pay-fund-type.entity'].PayFundType },
                        },
                    },
                ],
                [
                    import('./resources/pay-funds/pay-funds.controller'),
                    {
                        PayFundsController: {
                            create: { type: t['./resources/pay-funds/entities/pay-fund.entity'].PayFund },
                            findOne: { type: t['./resources/pay-funds/entities/pay-fund.entity'].PayFund },
                            update: { type: t['./resources/pay-funds/entities/pay-fund.entity'].PayFund },
                            remove: { type: t['./resources/pay-funds/entities/pay-fund.entity'].PayFund },
                            findAll: { type: [t['./resources/pay-funds/entities/pay-fund.entity'].PayFund] },
                        },
                    },
                ],
                [
                    import('./resources/payrolls/payrolls.controller'),
                    {
                        PayrollsController: {
                            create: { type: t['./resources/payrolls/entities/payroll.entity'].Payroll },
                            findAll: { type: [t['./resources/payrolls/entities/payroll.entity'].Payroll] },
                            findOne: { type: t['./resources/payrolls/entities/payroll.entity'].Payroll },
                            update: { type: t['./resources/payrolls/entities/payroll.entity'].Payroll },
                            remove: { type: t['./resources/payrolls/entities/payroll.entity'].Payroll },
                        },
                    },
                ],
                [
                    import('./resources/pay-periods/pay-periods.controller'),
                    {
                        PayPeriodsController: {
                            create: { type: t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod },
                            findAll: { type: [t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod] },
                            findCurrent: { type: t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod },
                            findOne: { type: t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod },
                            update: { type: t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod },
                            remove: { type: t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod },
                            close: { type: t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod },
                            open: { type: t['./resources/pay-periods/entities/pay-period.entity'].PayPeriod },
                        },
                    },
                ],
                [
                    import('./resources/positions/positions.controller'),
                    {
                        PositionsController: {
                            create: { type: t['./resources/positions/entities/position.entity'].Position },
                            findAll: { type: [t['./resources/positions/entities/position.entity'].Position] },
                            findOne: { type: t['./resources/positions/entities/position.entity'].Position },
                            update: { type: t['./resources/positions/entities/position.entity'].Position },
                            remove: { type: t['./resources/positions/entities/position.entity'].Position },
                            findBalance: {
                                type: [
                                    t['./resources/positions/dto/position-balance-extended.dto']
                                        .PositionBalanceExtendedDto,
                                ],
                            },
                            findFirstByPersonId: { type: t['./resources/positions/entities/position.entity'].Position },
                        },
                    },
                ],
                [
                    import('./resources/payment-positions/payment-positions.controller'),
                    {
                        PaymentPositionsController: {
                            create: {
                                type: t['./resources/payment-positions/entities/paymentPosition.entity']
                                    .PaymentPosition,
                            },
                            findAll: {
                                type: [
                                    t['./resources/payment-positions/entities/paymentPosition.entity'].PaymentPosition,
                                ],
                            },
                            findOne: {
                                type: t['./resources/payment-positions/entities/paymentPosition.entity']
                                    .PaymentPosition,
                            },
                            update: {
                                type: t['./resources/payment-positions/entities/paymentPosition.entity']
                                    .PaymentPosition,
                            },
                            remove: {
                                type: t['./resources/payment-positions/entities/paymentPosition.entity']
                                    .PaymentPosition,
                            },
                        },
                    },
                ],
                [
                    import('./resources/payments/payments.controller'),
                    {
                        PaymentsController: {
                            create: { type: t['./resources/payments/entities/payment.entity'].Payment },
                            findAll: { type: [t['./resources/payments/entities/payment.entity'].Payment] },
                            findOne: { type: t['./resources/payments/entities/payment.entity'].Payment },
                            update: { type: t['./resources/payments/entities/payment.entity'].Payment },
                            remove: { type: t['./resources/payments/entities/payment.entity'].Payment },
                            restore: { type: t['./resources/payments/entities/payment.entity'].Payment },
                            process: { type: t['./resources/payments/entities/payment.entity'].Payment },
                            withdraw: { type: t['./resources/payments/entities/payment.entity'].Payment },
                        },
                    },
                ],
                [
                    import('./resources/payment-types/payment-types.controller'),
                    {
                        PaymentTypesController: {
                            create: { type: t['./resources/payment-types/entities/payment-type.entity'].PaymentType },
                            findAll: {
                                type: [t['./resources/payment-types/entities/payment-type.entity'].PaymentType],
                            },
                            findOne: { type: t['./resources/payment-types/entities/payment-type.entity'].PaymentType },
                            update: { type: t['./resources/payment-types/entities/payment-type.entity'].PaymentType },
                            remove: { type: t['./resources/payment-types/entities/payment-type.entity'].PaymentType },
                        },
                    },
                ],
                [
                    import('./resources/persons/person.controller'),
                    {
                        PersonsController: {
                            create: { type: t['./resources/persons/entities/person.entity'].Person },
                            findAll: { type: [t['./resources/persons/entities/person.entity'].Person] },
                            findOne: { type: t['./resources/persons/entities/person.entity'].Person },
                            update: { type: t['./resources/persons/entities/person.entity'].Person },
                            remove: { type: t['./resources/persons/entities/person.entity'].Person },
                        },
                    },
                ],
                [
                    import('./resources/position-history/position-history.controller'),
                    {
                        PositionHistoryController: {
                            create: {
                                type: t['./resources/position-history/entities/position-history.entity']
                                    .PositionHistory,
                            },
                            findAll: {
                                type: [
                                    t['./resources/position-history/entities/position-history.entity'].PositionHistory,
                                ],
                            },
                            findLast: { type: Object },
                            findOne: {
                                type: t['./resources/position-history/entities/position-history.entity']
                                    .PositionHistory,
                            },
                            update: {
                                type: t['./resources/position-history/entities/position-history.entity']
                                    .PositionHistory,
                            },
                            remove: {
                                type: t['./resources/position-history/entities/position-history.entity']
                                    .PositionHistory,
                            },
                        },
                    },
                ],
                [
                    import('./resources/tasks/tasks.controller'),
                    {
                        TasksController: {
                            create: { type: t['./resources/tasks/entities/task.entity'].Task },
                            findAll: { type: [t['./resources/tasks/entities/task.entity'].Task] },
                            findOne: { type: t['./resources/tasks/entities/task.entity'].Task },
                            update: { type: t['./resources/tasks/entities/task.entity'].Task },
                            remove: { type: t['./resources/tasks/entities/task.entity'].Task },
                        },
                    },
                ],
                [
                    import('./resources/work-time-norm/work-time-norm.controller'),
                    {
                        WorkTimeNormController: {
                            create: {
                                type: t['./resources/work-time-norm/entities/work-time-norm.entity'].WorkTimeNorm,
                            },
                            findAll: {
                                type: [t['./resources/work-time-norm/entities/work-time-norm.entity'].WorkTimeNorm],
                            },
                            findOne: {
                                type: t['./resources/work-time-norm/entities/work-time-norm.entity'].WorkTimeNorm,
                            },
                            update: {
                                type: t['./resources/work-time-norm/entities/work-time-norm.entity'].WorkTimeNorm,
                            },
                            remove: {
                                type: t['./resources/work-time-norm/entities/work-time-norm.entity'].WorkTimeNorm,
                            },
                        },
                    },
                ],
                [
                    import('./auth/auth.controller'),
                    {
                        AuthController: {
                            register: { type: t['./auth/dto/tokens.dto'].TokensDto },
                            login: { type: t['./auth/dto/tokens.dto'].TokensDto },
                            logout: {},
                            refreshTokens: { type: t['./auth/dto/tokens.dto'].TokensDto },
                            demo: { type: t['./auth/dto/auth.dto'].AuthDto },
                        },
                    },
                ],
                [
                    import('./app/app.controller'),
                    {
                        AppController: {
                            getHello: { type: String },
                            ping: { type: String },
                            getTitle: { type: String },
                            getLocales: {},
                            addLocales: {},
                        },
                    },
                ],
            ],
        },
    };
};
