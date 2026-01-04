import { MigrationInterface, QueryRunner } from 'typeorm';
import { WorkTimeNorm, WorkTimeNormDay } from '../resources/work-time-norm/entities';
import { WorkTimeNormType } from '../types';
import { langPipe } from '../utils/lib/lang-pipe';
import { getSystemUserId } from '../utils/lib/system-user';

const lang = process.env.LANGUAGE ?? 'uk';
const entity = WorkTimeNorm;
const recordList = [
    {
        id: '1',
        code: '1',
        name: {
            en: '5 days, 40 hours per week (8*5)',
            uk: '5 днів, 40 годин на тиждень (8*5)',
        },
        description: {
            en: '5 days, 40 hours per week (Mon-Fri: 8 h/day)',
            uk: '5 днів, 40 годин на тиждень (Пн–Пт: 8 год/день)',
        },
        type: WorkTimeNormType.Day,
        dateFrom: '2024-04-22',
        dateTo: '9999-12-31',

        days: [
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
        id: '2',
        code: '2',
        name: {
            en: '6 days, 40 hours per week (7*5+5)',
            uk: '6 днів, 40 годин на тиждень (7*5+5)',
        },
        description: {
            en: '6 days, 40 hours per week (Mon–Fri: 7 h/day, Sat: 5 h)',
            uk: '6 днів, 40 годин на тиждень (Пн–Пт: 7 год/день, Сб: 5 год)',
        },
        type: WorkTimeNormType.Day,
        dateFrom: '2022-02-24',
        dateTo: '9999-12-31',
        days: [
            { day: 0, hours: 7 },
            { day: 1, hours: 7 },
            { day: 2, hours: 5 },
            { day: 3, hours: 0 },
            { day: 4, hours: 7 },
            { day: 5, hours: 7 },
            { day: 6, hours: 7 },
        ],
    },
    {
        id: '3',
        code: '3',
        name: {
            en: '5 days, 39 hours per week (8*4+7)',
            uk: '5 днів, 39 годин на тиждень (8*4+7)',
        },
        description: {
            en: '5 days, 39 hours per week (Mon–Thu: 8 h/day, Fri: 7 h)',
            uk: '5 днів, 39 годин на тиждень (Пн–Чт: 8 год/день, Пт: 7 год)',
        },
        type: WorkTimeNormType.Day,
        dateFrom: '2024-04-22',
        dateTo: '9999-12-31',
        days: [
            { day: 0, hours: 8 },
            { day: 1, hours: 8 },
            { day: 2, hours: 8 },
            { day: 3, hours: 8 },
            { day: 4, hours: 7 },
            { day: 5, hours: 0 },
            { day: 6, hours: 0 },
        ],
    },
    {
        id: '4',
        code: '4',
        name: {
            en: 'Shift schedule (1 day on, 3 days off)',
            uk: 'Змінна робота (один день - робочий, три - вихідні)',
        },
        description: {
            en: 'Shift work schedule: one working day followed by three rest days',
            uk: 'Змінна робота (один день - робочий, три - вихідні)',
        },
        type: WorkTimeNormType.Day,
        dateFrom: '2024-04-22',
        dateTo: '9999-12-31',
        applyHolidays: false,
        applyShortenedDays: false,
        applyMovedDays: false,
        applyPhases: true,
        days: [
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
        let periodId = 1;
        for (let n = 0; n < recordList.length; n++) {
            const { days: _, ...workTimeNorm } = recordList[n];
            workTimeNorm['createdUserId'] = userId;
            workTimeNorm['updatedUserId'] = userId;
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, workTimeNorm))
                // .orUpdate(['name', 'type', 'date_from', 'date_to'], ['id'])
                .execute();

            for (let m = 0; m < recordList[n].days.length; m++) {
                const days = {
                    ...recordList[n].days[m],
                    id: String(periodId++),
                    workTimeNormId: workTimeNorm.id,
                    createdUserId: userId,
                    updatedUserId: userId,
                };

                await dataSource.createQueryBuilder().insert().into(WorkTimeNormDay).values(days).execute();
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
                .where('id = :id and createdUserId = :userId', { id: record.id, userId })
                .execute();
        }
    }
}
