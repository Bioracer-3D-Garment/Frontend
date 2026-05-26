import { type ChangeEvent } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface NewProjectDialogProps {
  open: boolean;
  name: string;
  onNameChange: (value: string) => void;
  onCoverImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onGalleryImagesChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  onClose: () => void;
  coverImageFileName: string;
  galleryImageCount: number;
  isCreating: boolean;
  errorMessage: string;
}

export function NewProjectDialog({
  open,
  name,
  onNameChange,
  onCoverImageChange,
  onGalleryImagesChange,
  onCreate,
  onClose,
  coverImageFileName,
  galleryImageCount,
  isCreating,
  errorMessage,
}: NewProjectDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-bold">Create New Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onCreate()}
          className="mt-2 [&_.MuiInputLabel-root]:!text-[#e2001a] [&_.MuiInputLabel-root.Mui-focused]:!text-[#e2001a] [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:!border-[#e2001a] [&_.MuiOutlinedInput-root:hover_.MuiOutlinedInput-notchedOutline]:!border-[#e2001a] [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:!border-[#e2001a]"
        />

        <div className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Cover image
          </label>
          <input type="file" accept="image/*" onChange={onCoverImageChange} />
          <p className="text-xs text-gray-500">
            {coverImageFileName || 'No cover image selected'}
          </p>

          <label className="block text-sm font-medium text-gray-700">
            Gallery images
          </label>
          <input type="file" accept="image/*" multiple onChange={onGalleryImagesChange} />
          <p className="text-xs text-gray-500">
            {galleryImageCount > 0 ? `${galleryImageCount} gallery image${galleryImageCount !== 1 ? 's' : ''} selected` : 'No gallery images selected'}
          </p>
        </div>

        {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={onClose} className="!text-black">
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          variant="contained"
          disabled={!name.trim() || isCreating}
          className="!bg-[#e2001a] !text-white font-bold transition-all hover:!bg-[#b80015] hover:scale-105 disabled:!bg-gray-300 disabled:!text-gray-500"
        >
          {isCreating ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}