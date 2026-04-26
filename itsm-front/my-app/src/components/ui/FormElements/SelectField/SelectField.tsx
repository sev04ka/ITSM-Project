import type { SelectHTMLAttributes } from 'react';
import { useController, type Control, type FieldValues, type FieldPath } from 'react-hook-form';

// import styles from './selectfield.module.css'
import { FieldLabel } from '../FieldLabel/FieldLabel';
import { FieldError } from '../FieldError/FieldError';
import { Select } from '../../Select/Select';


interface SelectFieldProps<T extends FieldValues = FieldValues>
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'type' | 'value' | 'name'> {
    name: FieldPath<T>;
    control: Control<T>;
    rules?: any;
    label?: string;
    options: readonly {
        value: string;
        label: string;
    }[];
    placeholder?: string
}

export const SelectField = <T extends FieldValues>({
    name,
    control,
    rules,
    label,
    options,
    placeholder,
}: SelectFieldProps<T>) => {
    const { field, fieldState } = useController({
        name,
        control,
        rules
    });

    return (
        <div>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={options}
                id={name}
                name={field.name}
                placeHolder={placeholder}

            />
            {fieldState.invalid && (
                <FieldError>{[fieldState.error?.message]}</FieldError>
            )}
        </div>
    )
}                       