import { type FC } from "react";
import { useQueryParams } from "../../../hooks/useQueryParams";
import './filterBar.css'


export const FilterBar: FC = () => {
    const { searchParams, setParams, resetParams } = useQueryParams()


    return (
        <div className="filterbar">
            <div className="filter-group">
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