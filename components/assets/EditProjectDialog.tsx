import { type ChangeEvent } from 'react';
import { Dialog } from '@mui/material';
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
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Edit Folder</h2>

        <label className="block text-sm font-medium text-[#e2001a] mt-6">Folder name</label>
        <input
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Folder name"
          className="mt-2 w-full rounded-md border-2 border-[#e2001a] px-4 py-3 text-lg focus:outline-none"
        />

        <label className="block text-sm font-medium text-gray-700 mt-6">Cover Image</label>
        <label className="mt-2 block w-full border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-gray-700 cursor-pointer">
          <div className="flex items-center justify-center gap-3">
            <AddPhotoAlternate className="text-2xl" />
            <span className="font-semibold">CHOOSE IMAGE</span>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={onImageFileChange} />
        </label>

        <div className="mt-6">
          <p className="text-sm text-gray-500">Preview:</p>
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
            {projectImagePreview ? (
              <img src={projectImagePreview} alt="Preview" className="w-full h-56 object-cover" />
            ) : (
              <div className="w-full h-56 flex items-center justify-center text-gray-300">No preview available</div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button
            onClick={onSave}
            disabled={!projectName.trim()}
            className="bg-[#e2001a] text-white px-6 py-3 rounded shadow-md font-bold hover:bg-[#b80015] disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Dialog>
  );
}