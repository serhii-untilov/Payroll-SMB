import { DataSource } from 'typeorm';
import { User } from './../../resources/users/entities/user.entity';

export async function getSystemUserId(dataSource: DataSource): Promise<number> {
    const { user_id } = await dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .select('MIN(user.id)', 'user_id')
        .innerJoin('user.role', 'role')
        .where('role.type = :roleType', { roleType: 'system' })
        .getRawOne();
    return user_id;
}
