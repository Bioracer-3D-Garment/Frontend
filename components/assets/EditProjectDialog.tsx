import { Dialog } from "@mui/material";

interface EditProjectDialogProps {
  open: boolean;
  projectName: string;
  projectImageUrl: string;
  onProjectNameChange: (value: string) => void;
  onImageUrlChange: (url: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  isSaving?: boolean;
  saveError?: string;
  isDeleting?: boolean;
}

export function EditProjectDialog({
  open,
  projectName,
  projectImageUrl,
  onProjectNameChange,
  onImageUrlChange,
  onClose,
  onSave,
  onDelete,
  isSaving,
  saveError,
  isDeleting,
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
          Cover Image URL
        </label>
        <input
          type="url"
          value={projectImageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-2 w-full rounded-md border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:border-[#e2001a]"
        />

        <div className="mt-4">
          <p className="text-sm text-gray-500">Preview:</p>
          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
            {projectImageUrl ? (
              <img
                src={projectImageUrl}
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

        

        {saveError && (
          <p className="text-red-600 text-sm mt-3">{saveError}</p>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={onClose}
            className="text-gray-500"
            disabled={isSaving || isDeleting}
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting || isSaving}
            className="text-red-600 font-medium hover:text-red-800 disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete Folder"}
          </button>

          <button
            onClick={onSave}
            disabled={!projectName.trim() || isSaving || isDeleting}
            className="bg-[#e2001a] text-white px-6 py-3 rounded shadow-md font-bold hover:bg-[#b80015] disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
