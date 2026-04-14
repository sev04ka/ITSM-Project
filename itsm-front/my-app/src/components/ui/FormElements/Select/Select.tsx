import type { FC, SelectHTMLAttributes } from 'react';
import './select.css'

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onBlur' | 'value'> {
    field: {
        value: string | number | undefined;
        onChange: (...args: unknown[]) => void;
        onBlur: () => void;
        name: string;
        ref: (el: HTMLSelectElement | null) => void;
    };
    id?: string;
    options: readonly {
        value: string;
        label: string;
    }[];
}

export const Select: FC<SelectProps> = ({
    field,
    id,
    options
}) => {
    return (
        <select className='select'
            {...field}
            id={id}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>))}
        </select>
    )
}                       