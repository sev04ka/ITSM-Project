import type { FC } from "react";
import { TicketCommentList } from "../TicketCommentList/TicketCommentList";
import styles from './commentsection.module.css';
import { CreateComment } from "../CreateComment/CreateComment";

interface CommentSectionProps {
    ticketId: string
}

export const CommentSection: FC<CommentSectionProps> = ({
    ticketId,
}) => {
    return (
        <div className={styles.section}>
            <div className={styles["section-header"]}>
                <h2>Комментарии</h2>
            </div>
            <TicketCommentList ticketId={ticketId} />
            <CreateComment ticketId={ticketId} />
        </div>
    )
}
