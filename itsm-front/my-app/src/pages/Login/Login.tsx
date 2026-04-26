import type { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuthStore } from '../../store/useUserAuthStore';
import styles from './login.module.css'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldGroup } from '../../components/ui/FormElements/FieldGroup/FieldGroup';
import { InputField } from '../../components/ui/FormElements/InputField/InputField';
import { Button } from '../../components/ui/Button/Button';

const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(1, "пароль не может быть пустым"),
})


export const Login: FC = ({

}) => {
	const { currentUser, loading, error, login } = useUserAuthStore();

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onTouched',
		reValidateMode: 'onChange'
	});

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		await login(data.email, data.password);
	}


	if (currentUser) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className={styles.container}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<InputField
						name="email"
						control={form.control}
						type="email"
						autoComplete="off"
						label="email"
					/>
					<InputField
						name="password"
						control={form.control}
						type="password"
						autoComplete="off"
						label="password"
					/>
				</FieldGroup>
				<FieldGroup className="button">
					<Button
						type="submit"
						disabled={!form.formState.isValid}
					>
						Войти
					</Button>
				</FieldGroup>
			</form>
		</div>
	)
}