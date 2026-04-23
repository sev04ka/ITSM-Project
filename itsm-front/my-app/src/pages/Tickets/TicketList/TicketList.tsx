import { type FC, useState } from 'react';
import { DataManagementPanel } from "../../../components/ui/DataManagementPanel/DataManagementPanel";
import type { Column } from '../../../components/ui/DataManagementPanel/DataTable/types';
import type { ITicket } from '../../../interfaces/entities/Ticket';
import { formatDateTime } from '../../../utils/dateFormatter';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
    { value: "active", label: "Активен" },
    { value: "inactive", label: "Неактивен" },
    { value: "maintenance", label: "Обслуживание" },
    { value: "retired", label: "Выведен" },
] as const

const columns: Column<ITicket>[] = [
    {
        key: 'ticket_number',
        title: 'номер',
        template: (item: ITicket) => <Link to={`/tickets/${item.id}`}>{item.ticket_number}</Link>
    },
    {
        key: 'title',
        title: 'Наименование'
    },
    {
        key: 'priority',
        title: 'Приоритет',
    },
    {
        key: 'ticket_type',
        title: 'тип',
    },
    {
        key: 'status',
        title: 'Статус',
    },
    {
        key: 'requester',
        title: 'создатель',
        template: (item: ITicket) => `${item.requester.first_name} ${item.requester.last_name}`
    },
    {
        key: 'created_at',
        title: 'создан',
        template: (item: ITicket) => formatDateTime(item.created_at)
    },
];

export const TicketList: FC = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <DataManagementPanel<ITicket>
                header='Заявки'
                columns={columns}
                endpoint='/tickets'
            />
        </>
    );
};