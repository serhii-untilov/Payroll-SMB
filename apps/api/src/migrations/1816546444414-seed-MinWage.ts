import { getSystemUserId } from '@/utils/getSystemUserId';
import { MinWage } from '@/resources/min-wage/entities/min-wage.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

const entity = MinWage;
const recordList = [
    { dateFrom: '2024-04-01', dateTo: '2024-12-31', paySum: 8000 },
    { dateFrom: '2024-01-01', dateTo: '2024-03-31', paySum: 7100 },
    { dateFrom: '2023-01-01', dateTo: '2023-12-31', paySum: 6700 },
    { dateFrom: '2022-10-01', dateTo: '2022-12-31', paySum: 6700 },
    { dateFrom: '2022-01-01', dateTo: '2022-09-30', paySum: 6500 },
    { dateFrom: '2021-12-01', dateTo: '2021-12-31', paySum: 6500 },
    { dateFrom: '2021-01-01', dateTo: '2021-11-30', paySum: 6000 },
    { dateFrom: '2020-09-01', dateTo: '2020-12-31', paySum: 5000 },
    { dateFrom: '2020-01-01', dateTo: '2020-08-31', paySum: 4723 },
];

export class Seed1816546444414 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = {
                ...recordList[n],
                createdUserId: userId,
                updatedUserId: userId,
            };
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(record)
                // .orUpdate(['name', 'type', 'dateFrom', 'dateTo'], ['id'])
                .execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = recordList[n];
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('dateFrom = :dateFrom and createdUserId = :userId', {
                    dateFrom: record.dateFrom,
                    userId,
                })
                .execute();
        }
    }
}
