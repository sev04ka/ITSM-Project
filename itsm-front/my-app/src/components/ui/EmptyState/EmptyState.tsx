import type { FC } from "react";
import styles from './emptystate.module.css'

interface EmptyStateProps {
    message?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
    message = "Нет данных"
}) => {
    return (
        <div className={styles.container}>
            <h3>
                {message}
            </h3>
        </div>
    )
}