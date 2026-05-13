import { type ChangeEvent } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';

interface EditFolderDialogProps {
  open: boolean;
  folderName: string;
  folderImagePreview: string;
  onFolderNameChange: (value: string) => void;
  onImageFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
}

export function EditFolderDialog({
  open,
  folderName,
  folderImagePreview,
  onFolderNameChange,
  onImageFileChange,
  onClose,
  onSave,
}: EditFolderDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-bold">Edit Folder</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          autoFocus
          margin="dense"
          label="Folder name"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(event) => onFolderNameChange(event.target.value)}
          className="mt-2"
        />
        <div className="flex items-center gap-4">
          {folderImagePreview ? (
            <img src={folderImagePreview} alt="Folder preview" className="w-24 h-24 rounded object-cover border border-gray-200" />
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
          disabled={!folderName.trim()}
          className="bg-[#e2001a] font-bold transition-all hover:bg-[#b80015] hover:scale-105 disabled:bg-gray-500"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}