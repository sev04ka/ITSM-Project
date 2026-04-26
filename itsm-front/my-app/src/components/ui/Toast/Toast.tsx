import { type FC, useEffect, useRef, useState } from "react";
import styles from './toast.module.css'

import { type IToast } from './ToastContainer'

interface ToastProps {
    toast: IToast;
    removeToast: (id: string) => void;
    duration?: number;
}

export const Toast: FC<ToastProps> = ({
    toast,
    removeToast,
    duration = 5000,
}) => {
    const [progress, setProgress] = useState(100.0);
    const [isPaused, setIsPaused] = useState(false);



    useEffect(() => {
        if (isPaused) {
            setProgress(100.0)
            return
        }

        const interval = setInterval(() => {
            setProgress(progress - (1000.0 / duration))
            if (progress <= 0) {
                clearInterval(interval)
                removeToast(toast.id)
            }
        }, 10)

        return () => clearInterval(interval)
    }, [isPaused, removeToast, progress]);

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`${styles.toast} ${styles[toast.type]}`}
        >
            <div className={styles["time-bar"]} style={{ width: `${progress}%` }}></div>
            <p>
                {toast.message}
            </p>
        </div>
    )
}