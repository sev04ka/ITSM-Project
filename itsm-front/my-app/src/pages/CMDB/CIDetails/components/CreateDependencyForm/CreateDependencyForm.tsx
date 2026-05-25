import { useCallback, useEffect, useMemo, useState, useRef, type FC } from "react";
import z from "zod";
import type IConfigurationItem from "../../../../../interfaces/entities/ConfigurationItem";
import { useToast } from "../../../../../context/ToastContext";
import { api } from "../../../../../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "../../../../../components/ui/FormElements/FieldGroup/FieldGroup";
import { Button } from "../../../../../components/ui/Button/Button";
import { SelectField } from "../../../../../components/ui/FormElements/SelectField/SelectField";
import { InputField } from "../../../../../components/ui/FormElements/InputField/InputField";
import styles from './createdependencyform.module.css'

interface CreateDependencyFormProps {
    id: string;
    ciName: string;
    onDependencyCreated: () => void;
}


const DependencyCreateSchema = z.object({
    parent_id: z.string().min(1, "Родитель обязателен"),
    child_id: z.string().min(1, "Потомок обязателен"),
    label: z.string().min(3, "Укажите метку зависимости"),
})

export const CreateDependencyForm: FC<CreateDependencyFormProps> = ({
    id,
    ciName,
    onDependencyCreated
}) => {
    const [confItems, setConfItems] = useState<IConfigurationItem[]>([]);
    const [parentMode, setParentMode] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const toast = useToast();

    const fetchCI = useCallback(async () => {
        const response = await api.getList<IConfigurationItem>("/conf-items?all=true")
        if (response.success) {
            const items = Array.isArray(response.data.results) ? response.data.results : []
            setConfItems(items)
        }
    }, [])

    useEffect(() => {
        fetchCI();
    }, [])

    const form = useForm<z.infer<typeof DependencyCreateSchema>>({
        resolver: zodResolver(DependencyCreateSchema),
        defaultValues: {
            parent_id: '',
            child_id: id || '',
            label: ''
        },
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })

    const onSubmitAdd = async (data: z.infer<typeof DependencyCreateSchema>) => {
        const response = await api.post(
            '/ci-dependencies/',
            data,
            undefined,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            })

        if (response.success) {
            form.reset();
            form.setValue(parentMode ? 'parent_id' : 'child_id', id, { shouldValidate: false });
            toast.success("Зависимость успешно создана");
            onDependencyCreated();
        } else {
            toast.error(response.error?.message || "Ошибка при создании зависимости");
        }
    }

    const handleSwitch = useCallback(() => {
        setParentMode(prev => {
            const next = !prev;
            if (next) {
                form.setValue('parent_id', id, { shouldValidate: false });
                form.setValue('child_id', '', { shouldValidate: false });
            } else {
                form.setValue('child_id', id, { shouldValidate: false });
                form.setValue('parent_id', '', { shouldValidate: false });
            }
            form.clearErrors(['parent_id', 'child_id']);
            return next;
        });
    }, [id, form]);

    const ciOptions = useMemo(() => {
        return confItems.filter((item) => String(item.id) != id).map((item) => ({
            value: String(item.id),
            label: item.name
        }))
    }, [confItems, id])

    return (
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitAdd)} className={styles.form}>
            <FieldGroup>
                <div className={styles["mode-toggle"]}>
                    <span className={styles["mode-label"]}>Текущая КЕ:</span>
                    <button
                        type="button"
                        className={`${styles["mode-btn"]} ${!parentMode ? styles["mode-btn-active"] : ""}`}
                        onClick={!parentMode ? undefined : handleSwitch}
                    >
                        Потомок
                    </button>
                    <span className="arrow-right"></span>

                    <button
                        type="button"
                        className={`${styles["mode-btn"]} ${parentMode ? styles["mode-btn-active"] : ""}`}
                        onClick={parentMode ? undefined : handleSwitch}
                    >
                        Родитель
                    </button>
                </div>
            </FieldGroup>

            <FieldGroup orientation="horizontal">
                {parentMode ? (
                    <SelectField
                        name="child_id"
                        control={form.control}
                        label="Потомок"
                        options={ciOptions}
                        placeholder="Выберите потомка"
                    />
                ) : (
                    <div className={styles["ci-display"]}>
                        <span className={styles["ci-display-label"]}>Потомок</span>
                        <span className={styles["ci-display-value"]}>{ciName}</span>
                    </div>
                )}

                <div className={styles["label-field-wrapper"]}>
                    <InputField
                        name="label"
                        control={form.control}
                        type="text"
                        label="Метка"
                        placeholder="например: зависит от"
                    />
                </div>
                {parentMode ? (
                    <div className={styles["ci-display"]}>
                        <span className={styles["ci-display-label"]}>Родитель</span>
                        <span className={styles["ci-display-value"]}>{ciName}</span>
                    </div>
                ) : (
                    <SelectField
                        name="parent_id"
                        control={form.control}
                        label="Родитель"
                        options={ciOptions}
                        placeholder="Выберите родителя"
                    />
                )}
            </FieldGroup>

            <FieldGroup button="button-right">
                <Button
                    type="submit"
                    size="m"
                    disabled={!form.formState.isValid}
                >
                    Создать
                </Button>
            </FieldGroup>
        </form>
    )
}