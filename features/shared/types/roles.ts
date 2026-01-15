export interface IPermission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

export interface IRole {
  id: number;
  name: string;
  permissions: number[];
}

export interface IRolePopulated extends Omit<IRole, 'permissions'> {
  permissions: IPermission[]; 
}

export interface IRoleFormData {
  name: string;
  permissions: number[];
}
