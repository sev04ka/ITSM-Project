import type { FC } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../../../../api";
import { FieldGroup } from "../../../../../components/ui/FormElements/FieldGroup/FieldGroup";
import { TextArea } from "../../../../../components/ui/FormElements/TextArea/TextArea";
import { CheckBox } from "../../../../../components/ui/FormElements/CheckBox/CheckBox";
import styles from './createcomment.module.css'
import { Button } from "../../../../../components/ui/Button/Button";
import { useToast } from "../../../../../context/ToastContext";
import { useUserAuthStore } from "../../../../../store/useUserAuthStore";

const CommentCreateSchema = z.object({
    text: z.string().min(2, "Текст комментария не может быть пустым"),
    is_internal: z.boolean(),
})

interface CreateCommentProps {
    ticketId: string;
    onCommentCreate: () => void;
}

export const CreateComment: FC<CreateCommentProps> = ({
    ticketId,
    onCommentCreate
}) => {
    const { currentUser } = useUserAuthStore();
    const toast = useToast()

    const form = useForm<z.infer<typeof CommentCreateSchema>>({
        resolver: zodResolver(CommentCreateSchema),
        defaultValues: {
            text: '',
            is_internal: false,
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
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
            onCommentCreate();
            toast.success("Комментарий отправлен");
        } else {
            toast.error(response.error.message);
        }
    }


    return (
        <div className={styles["create-comment-section"]}>
            <form id="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <TextArea
                        name="text"
                        control={form.control}
                        placeholder="Введите текст комментария..."
                    />
                </FieldGroup>
                <FieldGroup
                    orientation="horizontal"
                    button={currentUser?.role.name != "user" ? undefined : "button-right"}
                >
                    {currentUser?.role.name != "user" &&
                        <CheckBox
                            name="is_internal"
                            control={form.control}
                            label="Только для персонала"
                        />
                    }
                    <Button type="submit" disabled={!form.formState.isValid}>
                        Отправить
                    </Button>
                </FieldGroup>
            </form>
        </div >
    )
}