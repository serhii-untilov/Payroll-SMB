import { User } from '../resources/users/entities/user.entity';
import { DataSource } from 'typeorm';

export async function getAdminId(dataSource: DataSource): Promise<number> {
    const { user_id } = await dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .select('MIN(user.id)', 'user_id')
        .innerJoin('user.role', 'role')
        .where('role.type = :type', { type: 'admin' })
        .getRawOne();
    return user_id;
}
