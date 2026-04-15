import type { FC } from "react";
import type { IComment } from "../../../interfaces/entities/Comment";
import styles from './ticketcomment.module.css'
import { formatDateTime } from "../../../utils/dateFormatter";

interface TicketCommentProps {
    comment: IComment
}

export const TicketComment: FC<TicketCommentProps> = ({
    comment
}) => {

    return (
        <div className={styles.comment}>
            <h2>{`${comment.author.first_name} ${comment.author.last_name} (${comment.author.role.name})`}</h2>
            <p>{comment.text}</p>
            <p>{formatDateTime(comment.created_at)}</p>
        </div>
    )
}