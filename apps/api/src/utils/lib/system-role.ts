import { DataSource } from 'typeorm';
import { Role } from '@/resources/role/entities/role.entity';
import { Logger } from '@nestjs/common';

const logger = new Logger(__filename);

export async function getRoleIdByType(dataSource: DataSource, roleType: string): Promise<number> {
    // debugger;
    // logger.debug(`!!! roleType ${roleType}`);
    // console.log('!!!');
    const { role_id } = await dataSource
        .getRepository(Role)
        .createQueryBuilder('role')
        .select('MIN(id)', 'role_id')
        .where('type = :roleType', { roleType })
        .getRawOne();
    if (!role_id) {
        logger.error(`!role_id for ${roleType}`);
    }
    return role_id;
}
