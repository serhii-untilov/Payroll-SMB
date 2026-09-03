import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserRole } from '../resources/user-role/entities/user-role.entity';

const entity = UserRole;
const recordList = [
    // system role for system user
    {
        id: '1',
        userId: '1',
        roleId: '1',
    },
    // system admin role for system admin user
    {
        id: '2',
        userId: '2',
        roleId: '2',
    },
];

export class Seed1809283090814 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(recordList[n])
                .orUpdate(['user_id', 'role_id'], ['id'])
                .execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('id = :id', { id: recordList[n].id })
                .execute();
        }
    }
}
