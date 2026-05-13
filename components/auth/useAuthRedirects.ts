import { useRouter } from 'next/router';

export function useAuthRedirects() {
	const router = useRouter();

	const redirectToHome = () => {
		router.replace('/');
	};

	const redirectToLogin = () => {
		router.replace('/login');
	};

	return { redirectToHome, redirectToLogin };
}