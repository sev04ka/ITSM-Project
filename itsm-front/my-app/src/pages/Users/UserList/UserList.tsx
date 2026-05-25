import { type FC } from 'react';
import { DataManagementPanel } from "../../../components/ui/DataManagementPanel/DataManagementPanel";
import type IUser from '../../../interfaces/entities/User'
import type { Column } from '../../../components/ui/DataManagementPanel/DataTable/types';
import { type FilterParams } from '../../../components/ui/DataManagementPanel/Filter/Filter';
import { useRole } from '../../../hooks/useRole';
import { roleLabels } from '../../../consts/Labels/roleLabels';


const columns: Column<IUser>[] = [
    {
        key: 'first_name',
        title: 'Имя'
    },
    {
        key: 'last_name',
        title: 'Фамилия'
    },
    {
        key: 'email',
        title: 'Почта'
    },
    {
        key: 'role',
        title: 'Роль',
        template: (item: IUser) => roleLabels[item.role.name]
    },
];

const filters: FilterParams[] = [

]

export const UserList: FC = () => {
    const { hasAccess } = useRole();

    let extraColumns: Column<IUser>[] = [];

    if (hasAccess(["super-admin"])) {
        extraColumns.push({
            key: 'organization',
            title: 'Организация',
            template: (item: IUser) => item.organization.name
        })
    }


    return (
        <>
            <DataManagementPanel<IUser>
                header='Пользователи'
                columns={columns.concat(extraColumns)}
                endpoint='/users'
                filters={filters}
            />
        </>
    );
};