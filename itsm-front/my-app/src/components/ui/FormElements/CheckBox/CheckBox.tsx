import type { InputHTMLAttributes } from 'react';
import { useController, type Control, type FieldValues, type FieldPath } from 'react-hook-form';

import { FieldLabel } from '../FieldLabel/FieldLabel';
import { FieldError } from '../FieldError/FieldError';

interface CheckBoxProps<T extends FieldValues = FieldValues>
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'name'> {
    name: FieldPath<T>;
    control: Control<T>;
    rules?: any;
    label?: string;
}

export const CheckBox = <T extends FieldValues>({
    name,
    control,
    rules,
    label,
}: CheckBoxProps<T>) => {
    const { field, fieldState } = useController({
        name,
        control,
        rules
    });

    return (
        <div>
            <input
                {...field}
                id={name}
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
            />
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            {fieldState.invalid && (
                <FieldError>{[fieldState.error?.message]}</FieldError>
            )}
        </div>
    )
}