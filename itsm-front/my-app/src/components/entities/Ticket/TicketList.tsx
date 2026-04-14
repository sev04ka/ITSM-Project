import { type FC, useState } from 'react';
import type { Column } from '../../ui/DataTable/types';
import { type ITicket } from '../../../interfaces/entities/Ticket';
import { DataManagementPanel } from '../../ui/DataManagementPanel/DataManagementPanel';
import { Modal } from '../../ui/Modal/Modal';
import { formatDateTime } from '../../../utils/dateFormatter';

export const TicketList: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const columns: Column<ITicket>[] = [
        {
            key: 'ticket_number',
            title: 'номер'
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

    return (
        <>
            <div className="list-header">
                <h1>Тикеты</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    Создать
                </button>
            </div>
            <DataManagementPanel<ITicket>
                columns={columns}
                endpoint='/tickets'
            />

            {/* <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Создание тикета"
            >
                <TicketCreateForm />
            </Modal> */}
        </>
    );
};