import type IOrganization from "./Organizations"
import type IRole from "./role"

export default interface IUser {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: IRole,
    organization: IOrganization
}
