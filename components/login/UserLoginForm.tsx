import { useState, type FormEvent } from 'react';
import { Typography } from '@mui/material';
import type { StatusMessage, UserLoginCredentials, UserLoginResult } from '@/types/types';

export interface UserLoginFormProps {
  onLogin: (credentials: UserLoginCredentials) => Promise<UserLoginResult>;
  title?: string;
  emailLabel?: string;
  passwordLabel?: string;
  submitLabel?: string;
  emailRequiredMessage?: string;
  passwordRequiredMessage?: string;
  passwordTooShortMessage?: string;
  unexpectedErrorMessage?: string;
}

export function UserLoginForm({
  onLogin,
  emailLabel = 'Email',
  passwordLabel = 'Password',
  submitLabel = 'Sign in',
  emailRequiredMessage = 'Email is required.',
  passwordRequiredMessage = 'Password is required.',
  passwordTooShortMessage = 'Password must be at least 8 characters.',
  unexpectedErrorMessage = 'Something went wrong. Please try again.',
}: UserLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setEmailError(emailRequiredMessage);
      valid = false;
    }

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setPasswordError(passwordRequiredMessage);
      valid = false;
    } else if (trimmedPassword.length < 8) {
      setPasswordError(passwordTooShortMessage);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await onLogin({ email: email.trim(), password });

      if (result.ok) {
        setStatusMessages(result.message ? [{ message: result.message, type: 'success' }] : []);
      } else {
        setStatusMessages([{ message: result.message, type: 'error' }]);
      }
    } catch {
      setStatusMessages([{ message: unexpectedErrorMessage, type: 'error' }]);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-600';

  return (
    <div className="space-y-6">

      {statusMessages.length > 0 && (
        <ul className="list-none space-y-1 m-0 p-0" role="status">
          {statusMessages.map(({ message, type }, index) => (
            <li key={index} className={type === 'error' ? 'text-red-800 text-sm' : 'text-green-800 text-sm'}>
              {message}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">{emailLabel}</span>
          <input
            id="user-login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClassName}
            disabled={submitting}
          />
          {emailError && <p className="mt-1 text-sm text-red-800 m-0">{emailError}</p>}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">{passwordLabel}</span>
          <input
            id="user-login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            disabled={submitting}
          />
          {passwordError && <p className="mt-1 text-sm text-red-800 m-0">{passwordError}</p>}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:pointer-events-none text-white font-bold py-3 rounded-md transition-colors"
        >
          {submitting ? 'Signing in…' : submitLabel}
        </button>
      </form>
    </div>
  );
}
