import { RoleType } from '../types';
import { Role } from './../resources/roles/entities/role.entity';
import { langPipe } from '../utils/lib/langPipe';
import { MigrationInterface, QueryRunner } from 'typeorm';

const lang = process.env.LANGUAGE || 'uk';
const entity = Role;
const recordList = [
    { name: { en: 'System', uk: 'Система' }, type: RoleType.SYSTEM },
    { name: { en: 'Admin', uk: 'Адміністратор' }, type: RoleType.ADMIN },
    { name: { en: 'Employer', uk: 'Роботодавець' }, type: RoleType.EMPLOYER },
    { name: { en: 'Employee', uk: 'Працівник' }, type: RoleType.EMPLOYEE },
    { name: { en: 'Guest', uk: 'Гість' }, type: RoleType.GUEST },
];

export class Seed1809292807183 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, recordList[n]))
                // .orUpdate(['name', 'type'], ['id'])
                .execute();
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
