import type { ICIType } from './CIType'

export interface IConfigurationItem {
    id: number,
    name: string,
    status: string,
    ci_type: ICIType,
    serial_number: string
}