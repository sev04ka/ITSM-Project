import { type FC } from 'react';
import { DataManagementPanel } from "../../../components/ui/DataManagementPanel/DataManagementPanel";
import type { Column } from '../../../components/ui/DataManagementPanel/DataTable/types';
import type ITicket from '../../../interfaces/entities/Ticket';
import { formatDateTime } from '../../../utils/dateFormatter';
import { Link } from 'react-router-dom';
import { type FilterParams } from '../../../components/ui/DataManagementPanel/Filter/Filter';
import { typeLabels } from '../../../consts/ticketTypeLabels';
import { statusLabels } from '../../../consts/statusLabels';
import { priorityLabels } from '../../../consts/priorityLables';
import { priorityBadge } from '../../../consts/Badges/priorityBadges';
import { typeBadge } from '../../../consts/Badges/ticketTypeBadges';
import { statusBadge } from '../../../consts/Badges/statusBadges';


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
        template: (item: ITicket) => <span className={`badge ${priorityBadge[item.priority] || ''}`}>{priorityLabels[item.priority]}</span>,
        sortable: true
    },
    {
        key: 'ticket_type',
        title: 'тип',
        template: (item: ITicket) => <span className={`badge ${typeBadge[item.ticket_type] || ''}`}>{typeLabels[item.ticket_type]}</span>
    },
    {
        key: 'status',
        title: 'Статус',
        template: (item: ITicket) => <span className={`badge ${statusBadge[item.status] || ''}`}>{statusLabels[item.status]}</span>
    },
    {
        key: 'requester',
        title: 'создатель',
        template: (item: ITicket) => `${item.requester.first_name} ${item.requester.last_name}`
    },
    {
        key: 'created_at',
        title: 'дата создания',
        template: (item: ITicket) => formatDateTime(item.created_at),
        sortable: true
    },
];

const STATUS_OPTIONS = [
    { value: "new", label: "Новый" },
    { value: "waiting", label: "В ожидании" },
    { value: "in_progress", label: "В работе" },
    { value: "resolved", label: "Решён" },
    { value: "closed", label: "Закрыт" },
    { value: "cancelled", label: "Отменён" },
] as const

const TYPE_OPTIONS = [
    { value: "incident", label: "Инцидент" },
    { value: "service_request", label: "Запрос" },
]

const PRIORITY_OPTIONS = [
    { value: "5", label: "Критичный" },
    { value: "4", label: "Высокий" },
    { value: "3", label: "Средний" },
    { value: "2", label: "Нормальный" },
    { value: "1", label: "Низкий" },
]

const filters: FilterParams[] = [
    {
        fieldName: 'status',
        options: STATUS_OPTIONS,
        placeHolder: 'Статус'
    },
    {
        fieldName: 'ticket_type',
        options: TYPE_OPTIONS,
        placeHolder: 'Тип'
    },
    {
        fieldName: 'priority',
        options: PRIORITY_OPTIONS,
        placeHolder: 'Приоритет'
    }
]

export const TicketList: FC = () => {
    return (
        <>
            <DataManagementPanel<ITicket>
                header='Заявки'
                columns={columns}
                endpoint='/tickets'
                allowControls={false}
                filters={filters}
            />
        </>
    );
};