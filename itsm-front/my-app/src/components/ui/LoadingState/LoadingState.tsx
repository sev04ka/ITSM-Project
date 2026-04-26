import type { FC } from "react";
import styles from './loadingstate.module.css'

export const LoadingState: FC = () => {
    return (
        <div className={styles.container}>
            <h3>
                loading...
            </h3>
        </div>
    )
}