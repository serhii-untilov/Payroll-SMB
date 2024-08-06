import { MigrationInterface, QueryRunner } from 'typeorm';
import { ResourceType, RoleType } from '../types';
import { generateAccess_Full } from '../utils/lib/access';
import { getSystemUserId } from '../utils/lib/getSystemUserId';
import { Access } from './../resources/access/entities/access.entity';

// Default access rules by Role Type.
// This table is read only for all role types. Changes for this table available only by migrations.
// Access config for Roles and Users in extra tables: RoleAccess, UserAccess - coming soon.

const entity = Access;
const recordList = [
    ...generateAccess_Full(RoleType.Admin, ResourceType.PaymentPosition),
    ...generateAccess_Full(RoleType.Employer, ResourceType.PaymentPosition),
];

export class Seed1821650962526 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = { ...recordList[n], createdUserId: userId, updatedUserId: userId };
            await dataSource.createQueryBuilder().insert().into(entity).values(record).execute();
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
                .where(
                    'roleType = :roleType AND resourceType = :resourceType AND accessType = :accessType AND createdUserId = :userId',
                    {
                        roleType: record.roleType,
                        resourceType: record.resourceType,
                        accessType: record.accessType,
                        userId,
                    },
                )
                .execute();
        }
    }
}
