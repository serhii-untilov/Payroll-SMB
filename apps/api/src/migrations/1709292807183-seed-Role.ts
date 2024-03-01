import { RoleType } from '@repo/shared';
import { Role } from '../resources/roles/entities/role.entity';
import { langPipe } from '../utils/langPipe';
import { MigrationInterface, QueryRunner } from 'typeorm';

const lang = process.env.LANGUAGE;
const entity = Role;
const recordList = [
    { id: 1, name: { en: 'Admin', uk: 'Адміністратор' }, type: RoleType.SYS_ADMIN },
    { id: 2, name: { en: 'Employer', uk: 'Роботодавець' }, type: RoleType.EMPLOYER },
    { id: 3, name: { en: 'Employee', uk: 'Працівник' }, type: RoleType.EMPLOYEE },
    { id: 4, name: { en: 'Guest', uk: 'Гість' }, type: RoleType.GUEST },
];

export class Seed1709292807183 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        recordList.forEach(async (record) => {
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                .orUpdate(['name', 'type'], ['id'])
                .execute();
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        recordList.forEach(async (record) => {
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('id = :id', { id: record.id })
                .execute();
        });
    }
}
