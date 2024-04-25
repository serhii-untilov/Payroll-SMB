import { getAdminId } from '../utils/getAdminId';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { WorkNorm } from '../resources/work-norms/entities/work-norm.entity';
import { langPipe } from '../utils/langPipe';
import { WorkNormType } from '@repo/shared';
import { WorkNormPeriod } from '../resources/work-norms/entities/work-norm-period.entity';

const lang = process.env.LANGUAGE;
const entity = WorkNorm;
const recordList = [
    {
        id: 1,
        name: {
            en: 'Full Time (5 days, 40 hours per week)',
            uk: 'Повний робочий день (5 днів, 40 годин на тиждень)',
        },
        type: WorkNormType.WEEKLY,
        dateFrom: '2024-04-22',
        dateTo: '9999-12-31',

        workNormPeriod: [
            { day: 0, hours: 8 },
            { day: 1, hours: 8 },
            { day: 2, hours: 8 },
            { day: 3, hours: 8 },
            { day: 4, hours: 8 },
            { day: 5, hours: 0 },
            { day: 6, hours: 0 },
        ],
    },
    // {
    //     id: 2,
    //     name: {
    //         en: 'Full Time (6 days, 40 hours per week)',
    //         uk: 'Повний робочий день (6 днів, 40 годин на тиждень)',
    //     },
    //     type: WorkNormType.WEEKLY,
    //     dateFrom: '2024-04-22',
    //     dateTo: '9999-12-31',
    // },
    // {
    //     id: 3,
    //     name: {
    //         en: 'Part-Time (5 days, 35 hours per week)',
    //         uk: 'Неповний робочий день (5 днів, 35 годин на тиждень)',
    //     },
    //     type: WorkNormType.WEEKLY,
    //     dateFrom: '2024-04-22',
    //     dateTo: '9999-12-31',
    // },
    // {
    //     id: 4,
    //     name: {
    //         en: 'Shift (one day - work, three days - rest)',
    //         uk: 'Зміна (один день - робота, три дні - відпочинок)',
    //     },
    //     type: WorkNormType.SHIFT,
    //     dateFrom: '2024-04-22',
    //     dateTo: '9999-12-31',
    // },
    // {
    //     id: 5,
    //     name: {
    //         en: 'Variable (hours vary every week)',
    //         uk: 'Змінна (години змінюються щотижня)',
    //     },
    //     type: WorkNormType.VARIABLE,
    //     dateFrom: '2024-04-22',
    //     dateTo: '9999-12-31',
    // },
];

export class Seed1813965395397 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getAdminId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const workNorm = {
                ...recordList[n],
                createdUserId: userId,
                updatedUserId: userId,
            };
            delete workNorm.workNormPeriod;
            const result = await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, workNorm))
                // .orUpdate(['name', 'type', 'dateFrom', 'dateTo'], ['id'])
                .execute();
            const { id: workNormId } = result.identifiers[0];
            for (let m = 0; m < recordList[n].workNormPeriod.length; m++) {
                const workNormPeriod = {
                    ...recordList[n].workNormPeriod[m],
                    workNormId,
                    createdUserId: userId,
                    updatedUserId: userId,
                };
                await dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(WorkNormPeriod)
                    .values(workNormPeriod)
                    .execute();
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const record = langPipe(lang, recordList[n]);
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('name = :name', { name: record.name })
                .execute();
        }
    }
}
