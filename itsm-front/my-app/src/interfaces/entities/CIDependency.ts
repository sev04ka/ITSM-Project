import type IConfigurationItem from "./ConfigurationItem";

export default interface ICIDependency {
    id: number,
    parent: IConfigurationItem,
    child: IConfigurationItem,
    label: string
}