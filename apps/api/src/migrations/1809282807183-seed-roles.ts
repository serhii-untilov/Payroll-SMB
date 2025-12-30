import { RoleType } from '../types';
import { Role } from '../resources/roles/entities/role.entity';
import { langPipe } from '../utils/lib/langPipe';
import { MigrationInterface, QueryRunner } from 'typeorm';

const lang = process.env.LANGUAGE ?? 'uk';
const entity = Role;
const recordList = [
    { id: '1', name: { en: 'System', uk: 'Система' }, type: RoleType.System },
    { id: '2', name: { en: 'Admin', uk: 'Адміністратор' }, type: RoleType.SystemAdmin },
    { id: '3', name: { en: 'Employer', uk: 'Роботодавець' }, type: RoleType.Accountant },
    { id: '4', name: { en: 'Employee', uk: 'Працівник' }, type: RoleType.Employee },
    { id: '5', name: { en: 'Guest', uk: 'Гість' }, type: RoleType.Manager },
];

export class Seed1809282807183 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, recordList[n]))
                .orUpdate(['name', 'type'], ['id'])
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
                .where('id = :id', { id: record.id })
                .execute();
        }
    }
}
