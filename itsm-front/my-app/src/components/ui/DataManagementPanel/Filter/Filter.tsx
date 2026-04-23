import type { FC } from "react";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { Select } from "../../Select/Select";

export interface FilterParams {
    fieldName: string;
    options: readonly {
        value: string;
        label: string;
    }[];
    placeHolder?: string;
}


interface FilterProps extends FilterParams {
}

export const Filter: FC<FilterProps> = ({
    options,
    fieldName,
    placeHolder
}) => {
    const { searchParams, setParams } = useQueryParams();
    const currentFilterParamValue = searchParams.get(fieldName) || ''

    const handleChange = (value: string) => {
        setParams({ [fieldName]: value });
    };

    return (
        <div>
            <Select
                initialValue={currentFilterParamValue}
                onChange={handleChange}
                options={options}
                placeHolder={placeHolder}
            />
        </div>
    )
}