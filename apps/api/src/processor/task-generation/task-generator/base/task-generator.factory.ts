import { TaskType } from '@/types';
import { NotFoundException } from '@nestjs/common';
import { TaskClosePayPeriod } from '../lib/task-close-pay-period';
import { TaskCreateCompany } from '../lib/task-create-company';
import { TaskFillDepartmentList } from '../lib/task-fill-department-list';
import { TaskFillPositionList } from '../lib/task-fill-position-list';
import { TaskHappyBirthday } from '../lib/task-happy-birthday';
import { TaskPostAccrualDocument } from '../lib/task-post-accrual-document';
import { TaskPostAdvancePayment } from '../lib/task-post-advance-payment';
import { TaskPostFssPayment } from '../lib/task-post-fss-payment';
import { TaskPostRegularPayment } from '../lib/task-post-regular-payment';
import { TaskPostWorkSheet } from '../lib/task-post-work-sheet';
import { TaskSendFssApplication } from '../lib/task-send-fss-application';
import { TaskSendIncomeTaxReport } from '../lib/task-send-income-tax-report';
import { TaskGenerator } from './task-generator';
import { Context } from './task-generator.context';

export function makeTaskGenerator(ctx: Context, type: TaskType): TaskGenerator {
    const found = [
        {
            type: TaskType.CreateCompany,
            generator: () => new TaskCreateCompany(ctx, type),
        },
        {
            type: TaskType.ClosePayPeriod,
            generator: () => new TaskClosePayPeriod(ctx, type),
        },
        {
            type: TaskType.PostAccrualDocument,
            generator: () => new TaskPostAccrualDocument(ctx, type),
        },
        {
            type: TaskType.PostAdvancePayment,
            generator: () => new TaskPostAdvancePayment(ctx, type),
        },
        {
            type: TaskType.SendApplicationFss,
            generator: () => new TaskSendFssApplication(ctx, type),
        },
        {
            type: TaskType.FillDepartmentList,
            generator: () => new TaskFillDepartmentList(ctx, type),
        },
        {
            type: TaskType.SendIncomeTaxReport,
            generator: () => new TaskSendIncomeTaxReport(ctx, type),
        },
        {
            type: TaskType.PostPaymentFss,
            generator: () => new TaskPostFssPayment(ctx, type),
        },
        {
            type: TaskType.FillPositionList,
            generator: () => new TaskFillPositionList(ctx, type),
        },
        {
            type: TaskType.PostRegularPayment,
            generator: () => new TaskPostRegularPayment(ctx, type),
        },
        {
            type: TaskType.PostWorkSheet,
            generator: () => new TaskPostWorkSheet(ctx, type),
        },
        {
            type: TaskType.HappyBirthday,
            generator: () => new TaskHappyBirthday(ctx, type),
        },
    ].find((o) => o.type === type);
    if (!found) {
        throw new NotFoundException('Task generator not found.');
    }
    return found.generator();
}
