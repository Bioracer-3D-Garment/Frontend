import { Alert, Snackbar } from '@mui/material';
import { AutoAwesome, Check, ErrorOutline } from '@mui/icons-material';
import type { GeneratorStatus } from '@/types/types';

interface GenerationFeedbackProps {
  status: GeneratorStatus;
  onClose: () => void;
  onClick: () => void;
}

function feedbackIcon(severity: GeneratorStatus['severity']) {
  if (severity === 'success') return <Check />;
  if (severity === 'error') return <ErrorOutline />;
  return <AutoAwesome />;
}

function feedbackClassName(severity: GeneratorStatus['severity']) {
  const base = '!text-white !font-semibold transition-all [&_.MuiAlert-icon]:!text-white';
  if (severity === 'success') {
    return `${base} !bg-black !border !border-[#e2001a] cursor-pointer hover:!bg-gray-900 hover:!-translate-y-0.5 hover:!shadow-md [&_.MuiAlert-icon]:!text-[#e2001a]`;
  }
  if (severity === 'warning') {
    return `${base} !bg-gray-800 !border !border-yellow-500 cursor-pointer hover:!bg-gray-700 hover:!-translate-y-0.5 hover:!shadow-md [&_.MuiAlert-icon]:!text-yellow-400`;
  }
  if (severity === 'error') {
    return `${base} !bg-[#b80015] !border !border-[#a50012]`;
  }
  return `${base} !bg-gray-900 !border !border-gray-600`;
}

export function GenerationFeedback({ status, onClose, onClick }: GenerationFeedbackProps) {
  return (
    <Snackbar
      open={status.open}
      autoHideDuration={status.severity === 'success' ? 5000 : null}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={status.severity}
        variant="filled"
        icon={feedbackIcon(status.severity)}
        onClick={onClick}
        className={feedbackClassName(status.severity)}
      >
        {status.message}
      </Alert>
    </Snackbar>
  );
}
