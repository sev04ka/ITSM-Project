import type { FC, ReactNode } from "react";
import './field.css'

interface FieldProps {
    children: ReactNode;
}

export const Field: FC<FieldProps> = ({
    children,
}) => {
    return (
        <div className="form-field">
            {children}
        </div>
    )
}