import type { IOrganization } from "./Organizations"
import { type IRole } from "./role"

export interface IUser {
    id: number,
    first_name: string,
    last_name: string,
    role: IRole,
    organization: IOrganization
}
