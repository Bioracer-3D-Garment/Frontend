import { type FormEvent } from 'react';
import { Typography } from '@mui/material';

interface LoginFormPanelProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function LoginFormPanel({ email, password, onEmailChange, onPasswordChange, onSubmit }: LoginFormPanelProps) {
  return (
    <div className="flex flex-col justify-between p-10 lg:p-16">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-8 bg-[#e2001a]" />
        <span className="font-extrabold tracking-[0.2em] text-black">BIORACER</span>
        <span className="font-light tracking-[0.2em] text-gray-500">STUDIO</span>
      </div>

      <div className="max-w-md w-full mx-auto py-12">
        <Typography variant="overline" className="text-[#e2001a] tracking-[0.2em] font-bold">
          WELCOME BACK
        </Typography>
        <Typography variant="h3" className="font-extrabold mt-1 mb-1 text-black leading-tight">
          Sign in to your studio.
        </Typography>
        <Typography variant="body1" className="text-gray-500 mb-8">
          Generate 3D product imagery & video for the Bioracer webshop.
        </Typography>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-600"
              placeholder="you@company.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-600"
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 mt-2 rounded-md">
            SIGN IN
          </button>
        </form>

        <Typography variant="caption" className="block text-center text-gray-400 mt-8">
          Sign In to enter the studio.
        </Typography>
      </div>

      <Typography variant="caption" className="text-gray-400">
        © {new Date().getFullYear()} Bioracer Studio
      </Typography>
    </div>
  );
}