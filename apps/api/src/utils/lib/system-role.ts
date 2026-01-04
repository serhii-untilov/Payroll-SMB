import { DataSource } from 'typeorm';
import { Role } from '../../resources/role/entities/role.entity';

export async function getRoleIdByType(dataSource: DataSource, roleType: string): Promise<number> {
    const { role_id } = await dataSource
        .getRepository(Role)
        .createQueryBuilder('role')
        .select('MIN(id)', 'role_id')
        .where('type = :roleType', { roleType })
        .getRawOne();
    return role_id;
}
