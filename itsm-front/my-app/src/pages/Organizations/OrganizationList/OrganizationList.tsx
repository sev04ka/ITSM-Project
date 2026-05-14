import { type FC } from 'react';
import { DataManagementPanel } from "../../../components/ui/DataManagementPanel/DataManagementPanel";
import type { Column } from '../../../components/ui/DataManagementPanel/DataTable/types';
import { type FilterParams } from '../../../components/ui/DataManagementPanel/Filter/Filter';
import type IOrganization from '../../../interfaces/entities/Organizations';


const columns: Column<IOrganization>[] = [
    {
        key: 'name',
        title: 'Название',
    },
];

const filters: FilterParams[] = [

]

export const OrganizationList: FC = () => {
    return (
        <>
            <DataManagementPanel<IOrganization>
                header='Организации'
                columns={columns}
                endpoint='/organizations'
                filters={filters}
            />
        </>
    );
};