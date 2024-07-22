import { MigrationInterface, QueryRunner } from 'typeorm';

const entityList = [
    'company',
    'department',
    'payment',
    'pay_period',
    'payroll',
    'person',
    'position',
    'position_history',
    'work_norm_period',
    'access',
    'accounting',
    'job',
    'min_wage',
    'pay_fund_type',
    'payment_position',
    'payment_type',
    'task',
    '"user"',
    'user_company',
    'work_norm',
];

export class Seed1721650905982 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < entityList.length; n++) {
            await dataSource.query(`update ${entityList[n]} set version = 1 where version is null`);
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {}
}
