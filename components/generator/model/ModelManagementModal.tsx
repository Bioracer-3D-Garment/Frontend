import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ArrowBack,
  CloudUpload,
  Check,
} from "@mui/icons-material";
import type { Model, ModelPhotos } from "@/types/types";
import { uploadImage } from "@/service/UploadService/uploadImage";

interface ModelManagementModalProps {
  open: boolean;
  models: Model[];
  onClose: () => void;
  onToggle: (id: number) => void;
  onAdd: (model: Omit<Model, "id" | "selected">) => Promise<number>;
  onUpdate: (id: number, updates: Partial<Omit<Model, "id">>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

interface FormState {
  name: string;
  gender: "male" | "female";
  profilePhoto: string | null;
  photos: { front: string | null; back: string | null; side: string | null };
}

type PhotoSlot = "profilePhoto" | "front" | "back" | "side";

function UploadZone({
  label,
  optional,
  preview,
  uploading,
  onFileSelected,
}: {
  label: string;
  optional?: boolean;
  preview: string | null;
  uploading: boolean;
  onFileSelected: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => onFileSelected(file);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </span>
        {optional && <span className="text-[10px] text-gray-400">(opt.)</span>}
      </div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f && !uploading) handleFile(f);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        className={`relative flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-150 ${
          uploading
            ? "cursor-wait border-gray-200 bg-gray-50"
            : dragging
              ? "scale-[1.02] cursor-pointer border-[#e2001a] bg-red-50 shadow-[0_0_0_4px_rgba(226,0,26,0.08)]"
              : preview
                ? "cursor-pointer border-[#e2001a]/40 bg-red-50/40 hover:border-[#e2001a]/70 hover:bg-red-50/70"
                : "cursor-pointer border-gray-200 bg-gray-50 hover:border-[#e2001a]/50 hover:bg-red-50/30"
        }`}
      >
        {uploading ? (
          <CircularProgress size={20} sx={{ color: "#e2001a" }} />
        ) : preview ? (
          <>
            <img
              src={
                process.env.NEXT_PUBLIC_PYTHON_SERVER_URL + "/files/" + preview
              }
              alt={label}
              className="h-full w-full rounded-xl object-cover"
            />
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/40 transition-opacity ${dragging ? "opacity-100" : "opacity-0 hover:opacity-100"}`}
            >
              <CloudUpload className="text-white" fontSize="small" />
              <span className="text-xs font-semibold text-white">
                {dragging ? "Drop to replace" : "Replace"}
              </span>
            </div>
          </>
        ) : (
          <>
            <CloudUpload
              className={`transition-colors ${dragging ? "text-[#e2001a]" : "text-gray-300"}`}
              fontSize="small"
            />
            <span
              className={`text-center text-xs leading-tight transition-colors ${dragging ? "font-semibold text-[#e2001a]" : "text-gray-400"}`}
            >
              {dragging ? "Drop to upload" : "Click or drag"}
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}

const emptyForm: FormState = {
  name: "",
  gender: "female",
  profilePhoto: null,
  photos: { front: null, back: null, side: null },
};

export function ModelManagementModal({
  open,
  models,
  onClose,
  onToggle,
  onAdd,
  onUpdate,
  onDelete,
}: ModelManagementModalProps) {
  const [view, setView] = useState<"list" | "form">("list");
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isNewModelPending, setIsNewModelPending] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingSlots, setUploadingSlots] = useState<Set<PhotoSlot>>(
    new Set(),
  );

  const selectedModels = models.filter((m) => m.selected);
  const activeGender = selectedModels[0]?.gender ?? null;
  const isDisabled = (model: Model) =>
    !model.selected && activeGender !== null && model.gender !== activeGender;

  const anyUploading = uploadingSlots.size > 0;

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormStep(1);
    setSubmitAttempted(false);
    setSaveError(null);
    setView("form");
  };

  const openEdit = (model: Model) => {
    setEditingId(model.id);
    setForm({
      name: model.name,
      gender: model.gender,
      profilePhoto:
        model.profilePicture !== model.photos?.front
          ? model.profilePicture
          : null,
      photos: {
        front: model.photos?.front ?? null,
        back: model.photos?.back ?? null,
        side: model.photos?.side ?? null,
      },
    });
    setSubmitAttempted(false);
    setSaveError(null);
    setView("form");
  };

  const resetForm = () => {
    setIsNewModelPending(false);
    setView("list");
    setFormStep(1);
    setEditingId(null);
    setForm(emptyForm);
    setSubmitAttempted(false);
    setSaveError(null);
    setUploadingSlots(new Set());
  };

  const handleBack = () => {
    // If the model was created in step 1 but the user cancels before completing
    // step 2, delete the incomplete record so it doesn't linger in the DB.
    if (isNewModelPending && editingId !== null) {
      onDelete(editingId).catch(() => {});
    }
    resetForm();
  };

  const handleClose = () => {
    handleBack();
    onClose();
  };

  const handlePhotoFile = (slot: PhotoSlot) => async (file: File) => {
    // Show a local blob preview immediately while uploading
    const blobUrl = URL.createObjectURL(file);
    if (slot === "profilePhoto") {
      setForm((f) => ({ ...f, profilePhoto: blobUrl }));
    } else {
      setForm((f) => ({ ...f, photos: { ...f.photos, [slot]: blobUrl } }));
    }

    setUploadingSlots((prev) => new Set(prev).add(slot));
    try {
      const pose = slot === "profilePhoto" ? "coverImage" : slot;
      const publicId = await uploadImage(file, pose, editingId ?? undefined);
      if (slot === "profilePhoto") {
        setForm((f) => ({ ...f, profilePhoto: publicId }));
      } else {
        setForm((f) => ({ ...f, photos: { ...f.photos, [slot]: publicId } }));
      }
    } catch {
      // Upload failed — clear the slot so the user can retry
      if (slot === "profilePhoto") {
        setForm((f) => ({ ...f, profilePhoto: null }));
      } else {
        setForm((f) => ({ ...f, photos: { ...f.photos, [slot]: null } }));
      }
    } finally {
      setUploadingSlots((prev) => {
        const next = new Set(prev);
        next.delete(slot);
        return next;
      });
    }
  };

  const photosValid = !!(
    form.photos.front &&
    form.photos.back &&
    form.photos.side
  );
  // step 1 (add, no editingId yet): only name needed; step 2 or edit: name + all photos
  const isFormValid =
    editingId !== null ? !!form.name.trim() && photosValid : !!form.name.trim();

  const showNameError = submitAttempted && !form.name.trim();

  // create the model record to get its real DB id, then advance.
  const handleCreate = async () => {
    setSubmitAttempted(true);
    if (!form.name.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const newId = await onAdd({
        name: form.name.trim(),
        gender: form.gender,
        profilePicture: "",
        photos: { front: "", back: "", side: "" },
        isCustom: true,
      });
      setEditingId(newId);
      setIsNewModelPending(true);
      setSubmitAttempted(false);
      setFormStep(2);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // save photos + details via PUT.
  const handleSave = async () => {
    setSubmitAttempted(true);
    if (!isFormValid || anyUploading || editingId === null) return;
    setSaving(true);
    setSaveError(null);
    try {
      const photos: ModelPhotos = {
        front: form.photos.front!,
        back: form.photos.back!,
        side: form.photos.side!,
      };
      const profilePicture = form.profilePhoto ?? photos.front;
      await onUpdate(editingId, {
        name: form.name.trim(),
        gender: form.gender,
        profilePicture,
        photos,
      });
      resetForm();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center gap-2 font-bold">
        {view === "form" && (
          <IconButton
            size="small"
            onClick={handleBack}
            disabled={saving}
            className="!mr-1"
          >
            <ArrowBack fontSize="small" />
          </IconButton>
        )}
        {view === "list"
          ? "Models"
          : isNewModelPending
            ? "Add model — Photos"
            : editingId !== null
              ? "Edit model"
              : "Add model"}
      </DialogTitle>

      <DialogContent className="!pt-2">
        {view === "list" ? (
          <div className="flex flex-col gap-2">
            {models.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                No models yet. Add one below.
              </p>
            )}
            {models.map((model) => {
              const disabled = isDisabled(model);
              return (
                <div
                  key={model.id}
                  onClick={() => !disabled && onToggle(model.id)}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    disabled
                      ? "cursor-not-allowed border-gray-100 bg-gray-50/30 opacity-40"
                      : model.selected
                        ? "cursor-pointer border-[#e2001a] bg-red-50/40 ring-1 ring-[#e2001a]/20"
                        : "cursor-pointer border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-100/50"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${model.selected ? "border-[#e2001a] bg-[#e2001a]" : "border-gray-300 bg-white"}`}
                  >
                    {model.selected && (
                      <Check sx={{ fontSize: 12 }} className="text-white" />
                    )}
                  </div>

                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-200 ring-1 ring-black/5">
                    <img
                      src={
                        process.env.NEXT_PUBLIC_PYTHON_SERVER_URL +
                        "/files/" +
                        model.profilePicture
                      }
                      alt={model.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {model.name}
                    </p>
                    <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-semibold capitalize text-red-600">
                      {model.gender}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(model);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="Edit"
                    >
                      <Edit fontSize="small" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(model.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400 transition-colors hover:bg-red-50 hover:text-[#e2001a]"
                      title="Delete"
                    >
                      <Delete fontSize="small" />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={openAdd}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-semibold text-gray-400 transition-all hover:border-[#e2001a]/40 hover:text-[#e2001a]"
            >
              <Add fontSize="small" />
              Add model
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pt-1">
            {/* Step indicator for add mode */}
            {(editingId === null || isNewModelPending) && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span
                  className={
                    !isNewModelPending ? "font-bold text-[#e2001a]" : ""
                  }
                >
                  1. Details
                </span>
                <span>→</span>
                <span
                  className={
                    isNewModelPending ? "font-bold text-[#e2001a]" : ""
                  }
                >
                  2. Photos
                </span>
              </div>
            )}

            {/* Name — visible in step 1 (add, editingId null) or edit (!isNewModelPending) */}
            {!isNewModelPending && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Model name"
                  className={`w-full rounded-xl border-2 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-300 focus:bg-white focus:border-[#e2001a] ${
                    showNameError
                      ? "border-[#e2001a]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                {showNameError && (
                  <span className="text-xs text-[#e2001a]">
                    Name is required
                  </span>
                )}
              </div>
            )}

            {/* Gender — visible in step 1 (add, editingId null) or edit (!isNewModelPending) */}
            {!isNewModelPending && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Gender
                </span>
                <ToggleButtonGroup
                  value={form.gender}
                  exclusive
                  onChange={(_, val) =>
                    val && setForm((f) => ({ ...f, gender: val }))
                  }
                  size="small"
                >
                  <ToggleButton
                    value="female"
                    className={`!px-6 !text-sm !font-semibold ${form.gender === "female" ? "!bg-[#e2001a] !text-white" : ""}`}
                  >
                    Female
                  </ToggleButton>
                  <ToggleButton
                    value="male"
                    className={`!px-6 !text-sm !font-semibold ${form.gender === "male" ? "!bg-[#e2001a] !text-white" : ""}`}
                  >
                    Male
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            )}

            {/* Photos — visible in step 2 (isNewModelPending) or edit (editingId set, not pending) */}
            {editingId !== null && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Photos
                </span>
                <div className="grid grid-cols-4 gap-3">
                  <UploadZone
                    label="Cover photo"
                    optional
                    preview={form.profilePhoto ?? form.photos.front}
                    uploading={uploadingSlots.has("profilePhoto")}
                    onFileSelected={handlePhotoFile("profilePhoto")}
                  />
                  {(["front", "back", "side"] as const).map((key) => (
                    <UploadZone
                      key={key}
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      preview={form.photos[key]}
                      uploading={uploadingSlots.has(key)}
                      onFileSelected={handlePhotoFile(key)}
                    />
                  ))}
                </div>
                {anyUploading && (
                  <p className="text-xs text-gray-400">Uploading photos…</p>
                )}
              </div>
            )}

            {saveError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-[#e2001a]">
                {saveError}
              </p>
            )}
          </div>
        )}
      </DialogContent>

      {view === "form" ? (
        <DialogActions className="px-6 pb-6">
          <Button
            onClick={handleBack}
            disabled={saving}
            className="!text-black"
          >
            Cancel
          </Button>

          {/* Step 1 (add mode): Create makes the DB record and advances */}
          {editingId === null && formStep === 1 ? (
            <Button
              onClick={handleCreate}
              variant="contained"
              disabled={saving}
              className="!bg-[#e2001a] !text-white font-bold transition-all hover:!bg-[#b80015] hover:scale-105"
              startIcon={
                saving ? (
                  <CircularProgress size={14} sx={{ color: "white" }} />
                ) : undefined
              }
            >
              Next
            </Button>
          ) : (
            /* Step 2 (add) or any edit: Save/Add button */
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!isFormValid || anyUploading || saving}
              className="!bg-[#e2001a] !text-white font-bold transition-all hover:!bg-[#b80015] hover:scale-105 disabled:!bg-gray-300 disabled:!text-gray-500"
              startIcon={
                saving ? (
                  <CircularProgress size={14} sx={{ color: "white" }} />
                ) : undefined
              }
            >
              {isNewModelPending ? "Add" : "Save"}
            </Button>
          )}
        </DialogActions>
      ) : (
        <DialogActions className="px-6 pb-6">
          <Button onClick={handleClose} className="!text-black">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
