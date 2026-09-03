import { DataSource } from 'typeorm';
// import { User } from '../../resources/user/entities/user.entity';
import { UserRole } from '../../resources/user-role/entities/user-role.entity';
import { RoleType } from '@/types';
import { Role } from '@/resources/role/entities/role.entity';
import { User } from '@/resources/user/entities/user.entity';

export async function getSystemUserId(dataSource: DataSource): Promise<string> {
    const { user_id } = await dataSource
        // .getRepository(User)
        // .createQueryBuilder('user')
        // .select('MIN(user.id)', 'user_id')
        // .innerJoin('user.role', 'role')
        // .where('role.type = :roleType', { roleType: 'system' })
        .getRepository(UserRole)
        .createQueryBuilder('user_roles')
        .select('MIN(user_roles.user_id)', 'user_id')
        .innerJoin(
            Role,
            'roles',
            'roles.id = user_roles.role_id and roles.type = :roleType and roles.deleted_date is null',
            {
                roleType: RoleType.System,
            },
        )
        .innerJoin(
            User,
            'users',
            'users.id = user_roles.user_id and users.is_active is true and users.deleted_date is null',
        )
        .where('user_roles.deleted_date is null')
        .getRawOne();

    return user_id;
}
