import { useEffect, useState, type FC, type ReactNode } from "react";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import styles from './filterbar.module.css'
import { Input } from "../../Input/Input";
import { Button } from "../../Button/Button";
import { Filter, type FilterParams } from "../Filter/Filter";

interface FilterBarProps {
    filters?: FilterParams[];
}

export const FilterBar: FC<FilterBarProps> = ({
    filters,
}) => {
    const { searchParams, setParams, resetParams } = useQueryParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setParams({ search: value }, false, 300);
    };

    return (
        <div className={styles.filterbar}>
            <div className={styles["search-and-reset"]}>
                <Input
                    name="search"
                    type="text"
                    placeholder={'search'}
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="filter-input"
                />
                <Button onClick={() => resetParams()}>
                    сброс
                </Button>
            </div>
            {filters &&
                <div className={styles.filters}>
                    {filters.map((filter) => (
                        <Filter
                            key={filter.fieldName}
                            {...filter}
                        />
                    ))}
                </div>
            }
        </div>
    )
}
