import type { FC, ReactNode } from "react";
import './fielderror.css'

interface FieldErrorProps {
    children: ReactNode;
}

export const FieldError: FC<FieldErrorProps> = ({
    children,
}) => {
    return (
        <div className="field-error">
            {children}
        </div>
    )
}