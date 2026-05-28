import { Dialog } from "@mui/material";
import { CldImage } from "next-cloudinary";

interface EditProjectDialogProps {
  open: boolean;
  projectName: string;
  projectImageTag: string;
  onProjectNameChange: (value: string) => void;
  onImageUrlChange: (url: string) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveError?: string;
}

export function EditProjectDialog({
  open,
  projectName,
  projectImageTag,
  onProjectNameChange,
  onImageUrlChange,
  onClose,
  onSave,
  isSaving,
  saveError,
}: EditProjectDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Edit Folder</h2>

        <label className="block text-sm font-medium text-[#e2001a] mt-6">
          Folder name
        </label>
        <input
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Folder name"
          className="mt-2 w-full rounded-md border-2 border-[#e2001a] px-4 py-3 text-lg focus:outline-none"
        />

        <label className="block text-sm font-medium text-gray-700 mt-6">
          Cover Image Tag
        </label>
        <input
          type="url"
          value={projectImageTag}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="Example_Tag"
          className="mt-2 w-full rounded-md border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:border-[#e2001a]"
        />

        <div className="mt-4">
          <p className="text-sm text-gray-500">Preview:</p>
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
            {projectImageTag ? (
              <CldImage
                width="300"
                height="300"
                src={projectImageTag}
                alt="Cover preview"
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 flex items-center justify-center text-gray-300">
                No preview available
              </div>
            )}
          </div>
        </div>

        {saveError && <p className="text-red-600 text-sm mt-3">{saveError}</p>}

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={onClose}
            className="text-gray-500"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!projectName.trim() || isSaving}
            className="bg-[#e2001a] text-white px-6 py-3 rounded shadow-md font-bold hover:bg-[#b80015] disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
