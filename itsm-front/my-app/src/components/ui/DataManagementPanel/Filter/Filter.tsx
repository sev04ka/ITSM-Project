import type { FC } from "react";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { Select } from "../../Select/Select";
import { useEntityList } from "../../../../hooks/useEntityList";

export interface FilterParams {
    fieldName: string;
    options?: readonly {
        value: string;
        label: string;
    }[];
    placeHolder?: string;
    endpoint?: string;
    optionLabelName?: string;
}

interface FilterProps extends FilterParams {
}

export const Filter: FC<FilterProps> = ({
    options,
    fieldName,
    placeHolder,
    endpoint = '',
    optionLabelName
}) => {
    const { searchParams, setParams } = useQueryParams();
    const currentFilterParamValue = searchParams.get(fieldName) || ''
    const { data } = useEntityList(endpoint, false);


    const mappedOptions = () => {
        return data.map((option: any) => ({
            value: String(option.id),
            label: String(option[optionLabelName ? optionLabelName : "id"])
        } as {
            value: string;
            label: string;
        }))
    }

    const handleChange = (value: string) => {
        setParams({ [fieldName]: value });
    };

    if (!options && endpoint == '') {
        return <div>Ошибка конфигурации фильтра</div>
    }

    return (
        <div>
            <Select
                value={currentFilterParamValue}
                onChange={handleChange}
                options={
                    endpoint != '' ? mappedOptions() : options || []
                }
                placeHolder={placeHolder}
            />
        </div>
    )
}