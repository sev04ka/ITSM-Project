import { type FC } from 'react';
import { DataManagementPanel } from "../../../components/ui/DataManagementPanel/DataManagementPanel";
import type IUser from '../../../interfaces/entities/User'
import type { Column } from '../../../components/ui/DataManagementPanel/DataTable/types';
import { type FilterParams } from '../../../components/ui/DataManagementPanel/Filter/Filter';


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
        template: (item: IUser) => item.role.name
    },
];

const filters: FilterParams[] = [

]

export const UserList: FC = () => {
    return (
        <>
            <DataManagementPanel<IUser>
                header='Пользователи'
                columns={columns}
                endpoint='/users'
                filters={filters}
            />
        </>
    );
};