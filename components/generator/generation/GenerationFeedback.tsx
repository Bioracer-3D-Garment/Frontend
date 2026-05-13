import { Alert, Snackbar } from '@mui/material';
import { AutoAwesome, Check } from '@mui/icons-material';
import type { GeneratorStatus } from '@/types/types';

interface GenerationFeedbackProps {
  status: GeneratorStatus;
  onClose: () => void;
  onClick: () => void;
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
        icon={status.severity === 'success' ? <Check /> : <AutoAwesome />}
        onClick={onClick}
        className={`!text-white !font-semibold transition-all [&_.MuiAlert-icon]:!text-[#e2001a] ${
          status.severity === 'success'
            ? '!bg-black !border !border-[#e2001a] cursor-pointer hover:!bg-gray-900 hover:!-translate-y-0.5 hover:!shadow-md'
            : '!bg-gray-900 !border !border-gray-600'
        }`}
      >
        {status.message}
      </Alert>
    </Snackbar>
  );
}