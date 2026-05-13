import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface NewFolderDialogProps {
  open: boolean;
  name: string;
  onNameChange: (value: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

export function NewFolderDialog({ open, name, onNameChange, onCreate, onClose }: NewFolderDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-bold">Create New Folder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Folder name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onCreate()}
          className="mt-2 [&_.MuiInputLabel-root]:!text-[#e2001a] [&_.MuiInputLabel-root.Mui-focused]:!text-[#e2001a] [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:!border-[#e2001a] [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-[#e2001a] [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[#e2001a]"
        />
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={onClose} className="!text-black">
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          variant="contained"
          disabled={!name.trim()}
          className="!bg-[#e2001a] !text-white font-bold transition-all hover:!bg-[#b80015] hover:scale-105 disabled:!bg-gray-300 disabled:!text-gray-500"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}