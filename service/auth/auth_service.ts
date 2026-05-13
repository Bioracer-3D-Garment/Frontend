import type { UserLoginCredentials } from '@/types/types';

const loginUser = (credentials: UserLoginCredentials) => {
	const base = process.env.NEXT_PUBLIC_API_URL;

	if (!base) {
		return Promise.reject(new Error('NEXT_PUBLIC_API_URL is not set'));
	}

	return fetch(`${base}/users/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: credentials.email,
			password: credentials.password,
		}),
	});
};

export const JWT_STORAGE_KEY = 'bioracer_jwt';

export function saveJwtToken(token: string): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(JWT_STORAGE_KEY, token);
}

export function getJwtToken(): string | null {
	if (typeof window === 'undefined') {
		return null;
	}
	return localStorage.getItem(JWT_STORAGE_KEY);
}

export function clearJwtToken(): void {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.removeItem(JWT_STORAGE_KEY);
}


const AuthService = {
	loginUser,
};

export default AuthService;
