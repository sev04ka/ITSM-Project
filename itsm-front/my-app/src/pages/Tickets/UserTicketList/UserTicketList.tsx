import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useEntityList } from "../../../hooks/useEntityList";
import type ITicket from '../../../interfaces/entities/Ticket'
import { TicketCard } from "./ticketCard/ticketCard";
import styles from './userticketlist.module.css'
import { Button } from "../../../components/ui/Button/Button";
import { EmptyState } from "../../../components/ui/EmptyState/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState/ErrorState";
import { LoadingState } from "../../../components/ui/LoadingState/LoadingState";

export const UserTicketList: FC = () => {
    const { data, loading, error } = useEntityList<ITicket>('/tickets/my')
    const navigate = useNavigate();

    return (
        <>
            <div className={styles["header"]}>
                <h1>Текущие заявки</h1>
                <Button
                    type="submit"
                    size="m"
                    onClick={() => navigate("add")}
                >
                    Создать
                </Button>
            </div>

            {loading && <LoadingState />}

            {error && <ErrorState message={error} />}

            {!loading && !error && (!data || data.length === 0) && (
                <EmptyState message="У вас пока нет заявок" />
            )}

            {!loading && !error && data && data.length > 0 &&
                <div className={styles["ticket-cards-container"]}>
                    {data.map((item) => <TicketCard key={item.id} {...item} />)}
                </div>
            }
        </>
    )
}

