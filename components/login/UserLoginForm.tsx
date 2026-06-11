import { useState, type FormEvent } from "react";
import { Typography } from "@mui/material";
import type {
  StatusMessage,
  UserLoginCredentials,
  UserLoginResult,
} from "@/types/types";

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
  title = "Sign in",
  emailLabel = "Email",
  passwordLabel = "Password",
  submitLabel = "Sign in",
  emailRequiredMessage = "Email is required.",
  passwordRequiredMessage = "Password is required.",
  passwordTooShortMessage = "Password must be at least 8 characters.",
  unexpectedErrorMessage = "Something went wrong. Please try again.",
}: UserLoginFormProps) {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    let valid = true;

    if (!email) {
      setEmailError(emailRequiredMessage);
      valid = false;
    }

    if (!password) {
      setPasswordError(passwordRequiredMessage);
      valid = false;
    } else if (password.trim().length < 8) {
      setPasswordError(passwordTooShortMessage);
      valid = false;
    }

    if (!valid) return;

    setSubmitting(true);

    try {
      const result = await onLogin({ email, password });

      if (result.ok) {
        setStatusMessages(
          result.message ? [{ message: result.message, type: "success" }] : [],
        );
      } else {
        setStatusMessages([{ message: result.message, type: "error" }]);
      }
    } catch {
      setStatusMessages([{ message: unexpectedErrorMessage, type: "error" }]);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-600";

  return (
    <div className="space-y-6">
      <Typography
        variant="h5"
        component="h2"
        className="font-extrabold text-black"
      >
        {title}
      </Typography>

      {statusMessages.length > 0 && (
        <ul className="space-y-1" role="status">
          {statusMessages.map((m, i) => (
            <li
              key={i}
              className={
                m.type === "error"
                  ? "text-red-800 text-sm"
                  : "text-green-800 text-sm"
              }
            >
              {m.message}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            {emailLabel}
          </span>
          <input
            name="email"
            type="email"
            autoComplete="username"
            className={inputClassName}
            disabled={submitting}
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-800">{emailError}</p>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            {passwordLabel}
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className={inputClassName}
            disabled={submitting}
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-800">{passwordError}</p>
          )}
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-3 rounded-md hover:cursor-pointer"
        >
          {submitting ? "Signing in…" : submitLabel}
        </button>
      </form>
    </div>
  );
}
