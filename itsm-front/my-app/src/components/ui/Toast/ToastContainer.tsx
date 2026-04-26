import type { FC } from "react";
import styles from './toast.module.css'
import { Toast } from "./Toast";

export interface IToast {
    id: string;
    message: string;
    type: string;
}


interface ToastContainerProps {
    toasts: IToast[];
    removeToast: (id: string) => void;
}

export const ToastContainer: FC<ToastContainerProps> = ({
    toasts,
    removeToast
}) => {
    if (toasts.length != 0)
        return (
            <div className={styles["toast-container"]}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        removeToast={removeToast}
                    />
                ))}
            </div>
        )
}