import { Typography } from '@mui/material';
import { UserLoginForm, type UserLoginFormProps } from '@/components/login/UserLoginForm';

export type LoginFormPanelProps = UserLoginFormProps;

export function LoginFormPanel(props: LoginFormPanelProps) {
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

        <UserLoginForm {...props} />

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
