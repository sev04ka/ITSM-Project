import { type FC, useState } from 'react';
import { DataManagementPanel } from "../../../components/ui/DataManagementPanel/DataManagementPanel";
import type { IConfigurationItem } from '../../../interfaces/entities/ConfigurationItem';
import type { Column } from '../../../components/ui/DataManagementPanel/DataTable/types';
import { type FilterParams, Filter } from '../../../components/ui/DataManagementPanel/Filter/Filter';

const STATUS_OPTIONS = [
    { value: "active", label: "Активен" },
    { value: "inactive", label: "Неактивен" },
    { value: "maintenance", label: "Обслуживание" },
    { value: "retired", label: "Выведен" },
] as const

const columns: Column<IConfigurationItem>[] = [
    {
        key: 'name',
        title: 'Название'
    },
    {
        key: 'serial_number',
        title: 'серийный номер',
    },
    {
        key: 'ci_type',
        title: 'Тип',
        template: (item: IConfigurationItem) => item.ci_type?.name
    },
    {
        key: 'status',
        title: 'Статус',
    },
];

const filters: FilterParams[] = [
    {
        fieldName: 'status',
        options: STATUS_OPTIONS,
        placeHolder: 'статус'
    }
]

export const CIList: FC = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <DataManagementPanel<IConfigurationItem>
                header='Конфигурационные единицы'
                columns={columns}
                endpoint='/conf-items'
                filters={filters}
            />
        </>
    );
};