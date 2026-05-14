import type { FC } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../api";
import { FieldGroup } from "../../ui/FormElements/FieldGroup/FieldGroup";
import { TextArea } from "../../ui/FormElements/TextArea/TextArea";
import { CheckBox } from "../../ui/FormElements/CheckBox/CheckBox";
import styles from './createcomment.module.css'
import { Button } from "../../ui/Button/Button";
import { useToast } from "../../../context/ToastContext";

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
    const toast = useToast()

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
            undefined,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) {
            form.reset();
            toast.success("Комментарий отправлен");
        } else {
            toast.error(response.error.message);
        }
    }


    return (
        <div className={styles["create-comment-section"]}>
            <h3>Написать комментарий</h3>
            <form id="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
                <div className={styles["form-body"]}>

                    <CheckBox
                        name="is_internal"
                        control={form.control}
                        label="Только для персонала"
                    />
                    <TextArea
                        name="text"
                        control={form.control}
                        placeholder="Введите текст комментария..."
                    />
                </div>
                <div className={styles["form-footer"]}>
                    <Button type="submit" disabled={!form.formState.isValid}>
                        Отправить
                    </Button>
                </div>
            </form>
        </div>
    )
}