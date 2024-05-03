export enum RoleType {
    // This role is used to update, migrate, and seed DB only and doesn't have access to any resource through the API.
    SYSTEM = 'system',

    ADMIN = 'admin',

    EMPLOYER = 'employer',
    OBSERVER = 'observer',

    EMPLOYEE = 'employee',

    GUEST = 'guest',
}
export interface IRole {
    id: number;
    name: string;
    type: string;
}

export type ICreateRole = Omit<IRole, 'id'>;
export type IUpdateRole = Partial<ICreateRole>;

export function canCreateUser(parentUserRoleType: string, childUserRoleType: string) {
    const whoMadeWho = [
        // ADMIN
        { parent: RoleType.ADMIN, child: RoleType.ADMIN },
        { parent: RoleType.ADMIN, child: RoleType.EMPLOYER },
        { parent: RoleType.ADMIN, child: RoleType.EMPLOYEE },
        { parent: RoleType.ADMIN, child: RoleType.GUEST },
        // EMPLOYER
        { parent: RoleType.EMPLOYER, child: RoleType.EMPLOYEE },
        { parent: RoleType.EMPLOYER, child: RoleType.GUEST },
    ];
    return (
        whoMadeWho.findIndex(
            (o) => o.parent === parentUserRoleType && o.child === childUserRoleType,
        ) >= 0
    );
}
