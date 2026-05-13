import { useState, type FormEvent } from 'react';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import { LoginFormPanel } from '@/components/login/LoginFormPanel';
import { LoginShowcasePanel } from '@/components/login/LoginShowcasePanel';

export default function LoginPage() {
	const { redirectToHome } = useAuthRedirects();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		redirectToHome();
	};

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
			<LoginFormPanel
				email={email}
				password={password}
				onEmailChange={setEmail}
				onPasswordChange={setPassword}
				onSubmit={handleLoginSubmit}
			/>
			<LoginShowcasePanel />
		</div>
	);
}
