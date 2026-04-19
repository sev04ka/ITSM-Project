import { type FC } from "react";
import { useQueryParams } from "../../../hooks/useQueryParams";
import styles from './filterbar.module.css'


export const FilterBar: FC = () => {
    const { searchParams, setParams, resetParams } = useQueryParams()


    return (
        <div className={styles.filterbar}>
            <div className={styles.search}>
                <input
                    type="text"
                    placeholder={'search'}
                    value={searchParams.get('search') || ''}
                    onChange={(e) => setParams({ 'search': e.target.value })}
                    className="filter-input"
                />
            </div>
            <div>
                <button onClick={() => resetParams()}>
                    сброс
                </button>
            </div>
        </div>
    )
}