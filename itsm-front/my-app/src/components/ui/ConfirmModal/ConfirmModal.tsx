import { type FC } from 'react';
import styles from './ConfirmModal.module.css';
import { Button } from '../Button/Button';


interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles['modal-overlay']} onClick={onCancel}>
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles['modal-actions']}>
                    <Button
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Удаление...' : 'Удалить'}
                    </Button>
                </div>
            </div>
        </div>
    );
};