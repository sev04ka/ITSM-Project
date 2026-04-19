import type { InputHTMLAttributes } from 'react';
import { useController, type Control, type FieldValues, type FieldPath } from 'react-hook-form';

import './input.css'
import { FieldLabel } from '../FieldLabel/FieldLabel';
import { FieldError } from '../FieldError/FieldError';


interface InputProps<T extends FieldValues = FieldValues>
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'name'> {
    name: FieldPath<T>;
    control: Control<T>;
    rules?: any;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
    label?: string;
}

export const Input = <T extends FieldValues>({
    name,
    control,
    rules,
    type = 'text',
    placeholder,
    autoComplete,
    label,
}: InputProps<T>) => {
    const { field, fieldState } = useController({
        name,
        control,
        rules
    });

    return (
        <div>
            <input className='input'
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onChange={(e) => field.onChange(e.target.value)}
            />
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            {fieldState.invalid && (
                <FieldError>{[fieldState.error?.message]}</FieldError>
            )}
        </div>
    )
}