import { LoginFormPanel } from '@/components/login/LoginFormPanel';
import { LoginShowcasePanel } from '@/components/login/LoginShowcasePanel';
import { useAuthRedirects } from '@/components/auth/useAuthRedirects';
import AuthService, { saveJwtToken } from '@/service/auth/auth_service';

type LoginJson = {
	token?: string;
	jwt?: string;
	accessToken?: string;
};

export default function LoginPage() {
	const { redirectToHome } = useAuthRedirects();

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
			<LoginFormPanel
				onLogin={async (credentials) => {
					const response = await AuthService.loginUser(credentials);

					if (!response.ok) {
						return { ok: false, message: 'Invalid email or password.' };
					}

					const data = (await response.json()) as LoginJson;
					const token = data.token ?? data.jwt ?? data.accessToken;

					if (!token || typeof token !== 'string') {
						return { ok: false, message: 'No token received from the server.' };
					}

					saveJwtToken(token);
					redirectToHome();
					return { ok: true };
				}}
			/>
			<LoginShowcasePanel />
		</div>
	);
}
