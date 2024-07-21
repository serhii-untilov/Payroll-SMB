import { WorkNorm, WorkNormPeriod } from './../resources/work-norms/entities';
import { WorkNormType } from '../types';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { getSystemUserId } from '../utils/lib/getSystemUserId';
import { langPipe } from '../utils/lib/langPipe';

const lang = process.env.LANGUAGE || 'uk';
const entity = WorkNorm;
const recordList = [
    {
        name: {
            en: '5 days, 40 hours per week',
            uk: '5 днів, 40 годин на тиждень',
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
    {
        id: 2,
        name: {
            en: '6 days, 40 hours per week',
            uk: '6 днів, 40 годин на тиждень',
        },
        type: WorkNormType.WEEKLY,
        dateFrom: '2024-04-22',
        dateTo: '9999-12-31',
        workNormPeriod: [
            { day: 0, hours: 7 },
            { day: 1, hours: 7 },
            { day: 2, hours: 7 },
            { day: 3, hours: 7 },
            { day: 4, hours: 7 },
            { day: 5, hours: 5 },
            { day: 6, hours: 0 },
        ],
    },
    {
        id: 3,
        name: {
            en: '5 days, 35 hours per week',
            uk: '5 днів, 35 годин на тиждень',
        },
        type: WorkNormType.WEEKLY,
        dateFrom: '2024-04-22',
        dateTo: '9999-12-31',
        workNormPeriod: [
            { day: 0, hours: 7 },
            { day: 1, hours: 7 },
            { day: 2, hours: 7 },
            { day: 3, hours: 7 },
            { day: 4, hours: 7 },
            { day: 5, hours: 0 },
            { day: 6, hours: 0 },
        ],
    },
    {
        id: 4,
        name: {
            en: 'Shifted (one day - work, three days - rest)',
            uk: 'Змінна (один день - робота, три - відпочинок)',
        },
        type: WorkNormType.SHIFTED,
        dateFrom: '2024-04-22',
        dateTo: '9999-12-31',
        workNormPeriod: [
            { day: 0, hours: 24 },
            { day: 1, hours: 0 },
            { day: 2, hours: 0 },
            { day: 3, hours: 0 },
        ],
    },
];

export class Seed1813965395397 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const { workNormPeriod: _, ...workNorm } = recordList[n];
            workNorm['createdUserId'] = userId;
            workNorm['updatedUserId'] = userId;
            const result = await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, workNorm))
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
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = langPipe(lang, recordList[n]);
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('name = :name and createdUserId = :userId', { name: record.name, userId })
                .execute();
        }
    }
}
