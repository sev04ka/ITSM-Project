import type { FC } from "react";
import styles from './errorstate.module.css'

interface ErrorStateProps {
    message?: string;
}

export const ErrorState: FC<ErrorStateProps> = ({
    message = "error"
}) => {
    return (
        <div className={styles.container}>
            <h3>
                {message}
            </h3>
        </div>
    )
}