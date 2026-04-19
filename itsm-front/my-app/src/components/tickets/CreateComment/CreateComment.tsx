import type { FC } from "react";
import { TicketComment } from "../TicketComment/TicketComment";
import { useEntityList } from "../../../hooks/useEntityList";
import type { IComment } from "../../../interfaces/entities/Comment";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../api";
import { FieldGroup } from "../../ui/FormElements/FieldGroup/FieldGroup";
import { TextArea } from "../../ui/FormElements/TextArea/TextArea";
import { CheckBox } from "../../ui/FormElements/CheckBox/CheckBox";


const CommentCreateSchema = z.object({
    text: z.string().min(2, "Текст комментария не может быть пустым"),
    is_internal: z.boolean(),
})

interface CreateCommentProps {
    ticketId: string;
}

export const CreateComment: FC<CreateCommentProps> = ({
    ticketId,
}) => {

    const form = useForm<z.infer<typeof CommentCreateSchema>>({
        resolver: zodResolver(CommentCreateSchema),
        defaultValues: {
            text: '',
            is_internal: false,
        },
        mode: 'onBlur'
    })

    const onSubmit = async (data: z.infer<typeof CommentCreateSchema>) => {
        const response = await api.post(
            `/comments/?ticket=${ticketId}`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
    }

    return (
        <form id="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <TextArea
                    name="text"
                    control={form.control}
                    label="text"
                />

                <CheckBox
                    name="is_internal"
                    control={form.control}
                    label="is_internal"
                />
            </FieldGroup>
            <button type="submit">Submit</button>
        </form>
    )
}