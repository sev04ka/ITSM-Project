import type { SelectHTMLAttributes } from 'react';
import { useController, type Control, type FieldValues, type FieldPath } from 'react-hook-form';

import './select.css'
import { FieldLabel } from '../FieldLabel/FieldLabel';
import { FieldError } from '../FieldError/FieldError';


interface SelectProps<T extends FieldValues = FieldValues>
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'type' | 'value' | 'name'> {
    name: FieldPath<T>;
    control: Control<T>;
    rules?: any;
    label?: string;
    options: readonly {
        value: string;
        label: string;
    }[];
}

export const Select = <T extends FieldValues>({
    name,
    control,
    rules,
    label,
    options,
}: SelectProps<T>) => {
    const { field, fieldState } = useController({
        name,
        control,
        rules
    });

    return (
        <div>
            <select className='select'
                {...field}
                id={name}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>))}
            </select>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            {fieldState.invalid && (
                <FieldError>{[fieldState.error?.message]}</FieldError>
            )}
        </div>
    )
}                       