export interface IUserManaged {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    last_login: string | null;
    date_joined: string;
    groups: number[];
    roles: { id: number; name: string }[];
}

export interface IUserFormData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
    groups: number[];
    is_active?: boolean;
}
