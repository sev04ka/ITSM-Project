import type ICIType from './CIType'
import type IUser from './User'

export default interface IConfigurationItem {
    id: number,
    name: string,
    status: "active" | "inactive" | "maintenance" | "retired",
    ci_type: ICIType,
    serial_number: string,
    owner: IUser;
}