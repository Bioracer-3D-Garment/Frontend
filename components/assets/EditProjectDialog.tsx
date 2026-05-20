import { type ChangeEvent } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';

interface EditProjectDialogProps {
  open: boolean;
  projectName: string;
  projectImagePreview: string;
  onProjectNameChange: (value: string) => void;
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
}

export function EditProjectDialog({
  open,
  projectName,
  projectImagePreview,
  onProjectNameChange,
  onImageFileChange,
  onClose,
  onSave,
}: EditProjectDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-bold">Edit Project</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          autoFocus
          margin="dense"
          label="Project name"
          type="text"
          fullWidth
          variant="outlined"
          value={projectName}
          onChange={(event) => onProjectNameChange(event.target.value)}
          className="mt-2"
        />
        <div className="flex items-center gap-4">
          {projectImagePreview ? (
            <img src={projectImagePreview} alt="Project preview" className="w-24 h-24 rounded object-cover border border-gray-200" />
          ) : (
            <div className="w-24 h-24 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
              <AddPhotoAlternate />
            </div>
          )}
          <Button variant="outlined" component="label">
            Change cover image
            <input type="file" hidden accept="image/*" onChange={onImageFileChange} />
          </Button>
        </div>
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={onClose} className="text-gray-500">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!projectName.trim()}
          className="bg-[#e2001a] font-bold transition-all hover:bg-[#b80015] hover:scale-105 disabled:bg-gray-500"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}