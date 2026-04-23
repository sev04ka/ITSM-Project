import type { ICIType } from './CIType'

export interface IConfigurationItem {
    id: number,
    name: string,
    status: "active" | "inactive" | "maintenance" | "retired",
    ci_type: ICIType,
    serial_number: string
}