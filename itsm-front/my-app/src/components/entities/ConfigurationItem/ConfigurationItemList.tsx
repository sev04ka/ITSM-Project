import { type FC, useState } from 'react';
import type { IConfigurationItem } from '../../../interfaces/entities/ConfigurationItem';
import type { Column } from '../../ui/DataTable/types';
import { Modal } from '../../ui/Modal/Modal';
import { CICreateForm } from './createForm';
import { DataManagementPanel } from '../../ui/DataManagementPanel/DataManagementPanel';


export const ConfigurationItemList: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: Column<IConfigurationItem>[] = [
        {
            key: 'id',
            title: 'id'
        },
        {
            key: 'name',
            title: 'Название'
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
        {
            key: 'serial_number',
            title: 'серийный номер',
        }
    ];

    return (
        <>
            <div className="list-header">
                <h1>Конфигурационные единицы</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                    Создать
                </button>
            </div>

            <DataManagementPanel<IConfigurationItem>
                columns={columns}
                endpoint='/conf-items'
            />

            {/* <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Создание конфигурационной единицы"
            >
                <CICreateForm />
            </Modal> */}
        </>
    );
};