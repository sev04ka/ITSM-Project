import { createContext, useContext, type ReactNode, type FC, useState } from "react";
import { ToastContainer, type IToast } from "../components/ui/Toast/ToastContainer";

interface ToastContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;

    removeToast: (id: string) => void;
}


const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({
    children
}) => {
    const [toasts, setToasts] = useState<IToast[]>([])

    const addToast = (message: string, type: string) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const success = (message: string) => {
        addToast(message, "success")
    }

    const error = (message: string) => {
        addToast(message, "error")
    }

    const warning = (message: string) => {
        addToast(message, "warning")
    }

    return (
        <ToastContext value={{ success, error, warning, removeToast }}>
            {children}

            <ToastContainer
                toasts={toasts}
                removeToast={removeToast}
            />
        </ToastContext>
    )
}



export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};