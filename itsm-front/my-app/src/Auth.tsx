import { useUserAuthStore } from './store/useUserAuthStore'
import type { FC, FormEvent } from 'react';
import { useState } from 'react';



const Auth: FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useUserAuthStore();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			await login(email, password);

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Неверный логин или пароль';
			setError(errorMessage);
		} finally {
			setIsLoading(false)
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div>
					<div>
						<input name='email' type="text" placeholder="email" value={email} required onChange={(e) => setEmail(e.target.value)} />
					</div>
					<div>
						<input name='password' type="text" placeholder="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
					</div>
					<div>
						<p>{error}</p>
					</div>
					<div>
						<button type='submit'>Войти</button>
					</div>
				</div>
			</form>
		</div>
	)
}

export default Auth
