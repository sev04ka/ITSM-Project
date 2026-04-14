import type { FC, PropsWithChildren } from "react";
import './fieldgroup.css'


export const FieldGroup: FC<PropsWithChildren> = ({
    children
}) => {
    return (
        <div className="field-group">
            {children}
        </div>
    )
}