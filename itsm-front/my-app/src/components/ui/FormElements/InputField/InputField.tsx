import type { InputHTMLAttributes } from 'react';
import { useController, type Control, type FieldValues, type FieldPath } from 'react-hook-form';

import styles from './input.module.css'
import { FieldLabel } from '../FieldLabel/FieldLabel';
import { FieldError } from '../FieldError/FieldError';
import { Input } from '../../Input/Input';
import { Field } from '../Field/Field';

interface InputFieldProps<T extends FieldValues = FieldValues>
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'name'> {
    name: FieldPath<T>;
    control: Control<T>;
    rules?: any;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
    label?: string;
}


export const InputField = <T extends FieldValues>({
    name,
    control,
    rules,
    type = 'text',
    placeholder,
    autoComplete,
    label,
    ...props
}: InputFieldProps<T>) => {
    const { field, fieldState } = useController({
        name,
        control,
        rules,
    });



    return (
        <Field>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Input
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={placeholder}
                autoComplete={autoComplete}
                type={type}
                {...props}
            />
            {fieldState.invalid && (
                <FieldError>{[fieldState.error?.message]}</FieldError>
            )}
        </Field>
    )
}