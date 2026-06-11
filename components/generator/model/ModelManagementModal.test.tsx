import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModelManagementModal } from "./ModelManagementModal";
import type { Model } from "@/types/types";

// uploadImage hits Cloudinary via fetch + JWT — mock it out for component tests.
const uploadImage = vi.fn();
vi.mock("@/service/cloudinary/uploadImage", () => ({
  uploadImage: (file: File) => uploadImage(file),
}));

function makeModel(overrides: Partial<Model> = {}): Model {
  return {
    id: 1,
    name: "Patrick",
    profilePicture: "https://example.com/p.jpg",
    gender: "male",
    selected: false,
    photos: { front: "f.jpg", back: "b.jpg", side: "s.jpg" },
    ...overrides,
  };
}

function renderModal(
  props: Partial<React.ComponentProps<typeof ModelManagementModal>> = {},
) {
  const handlers = {
    onClose: vi.fn(),
    onToggle: vi.fn(),
    onAdd: vi.fn().mockResolvedValue(undefined),
    onUpdate: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn().mockResolvedValue(undefined),
  };
  const utils = render(
    <ModelManagementModal open models={[]} {...handlers} {...props} />,
  );
  return { ...handlers, ...props, ...utils };
}

function fileInputs(): HTMLInputElement[] {
  // Order in the form: [cover, front, back, side]
  return Array.from(
    document.querySelectorAll<HTMLInputElement>('input[type="file"]'),
  );
}

const png = (name: string) => new File(["data"], name, { type: "image/png" });

beforeEach(() => {
  uploadImage.mockReset();
  uploadImage.mockResolvedValue("https://cdn.example.com/uploaded.jpg");
});

describe("ModelManagementModal — list view", () => {
  it("shows the empty state when there are no models", () => {
    renderModal({ models: [] });
    expect(screen.getByText(/no models yet/i)).toBeInTheDocument();
  });

  it("renders a row per model with name and gender", () => {
    renderModal({
      models: [
        makeModel({ id: 1, name: "Patrick", gender: "male" }),
        makeModel({ id: 2, name: "Gaelle", gender: "female" }),
      ],
    });
    expect(screen.getByText("Patrick")).toBeInTheDocument();
    expect(screen.getByText("Gaelle")).toBeInTheDocument();
    expect(screen.getByText("male")).toBeInTheDocument();
    expect(screen.getByText("female")).toBeInTheDocument();
  });

  it("toggles a model when its row is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    renderModal({ models: [makeModel({ id: 9, name: "Patrick" })], onToggle });

    await user.click(screen.getByText("Patrick"));

    expect(onToggle).toHaveBeenCalledWith(9);
  });

  it("disables models of a different gender once one gender is selected", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    renderModal({
      models: [
        makeModel({ id: 1, name: "Gaelle", gender: "female", selected: true }),
        makeModel({ id: 2, name: "Patrick", gender: "male", selected: false }),
      ],
      onToggle,
    });

    await user.click(screen.getByText("Patrick"));
    expect(onToggle).not.toHaveBeenCalled();

    await user.click(screen.getByText("Gaelle"));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it("calls onDelete when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderModal({ models: [makeModel({ id: 5, name: "Patrick" })], onDelete });

    await user.click(screen.getByTitle("Delete"));

    expect(onDelete).toHaveBeenCalledWith(5);
  });
});

describe("ModelManagementModal — add form", () => {
  it("opens the add form from the list", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: /add model/i }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Add model")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Model name")).toBeInTheDocument();
  });

  it("keeps the submit button disabled until name and all three photos are provided", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole("button", { name: /add model/i }));

    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Model name"), "New Model");
    expect(addButton).toBeDisabled(); // photos still missing

    const [, front, back, side] = fileInputs();
    await user.upload(front, png("front.png"));
    await user.upload(back, png("back.png"));
    await user.upload(side, png("side.png"));

    await waitFor(() => expect(addButton).toBeEnabled());
  });

  it("uploads each photo through uploadImage and submits the model via onAdd", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    renderModal({ onAdd });

    await user.click(screen.getByRole("button", { name: /add model/i }));
    await user.type(screen.getByPlaceholderText("Model name"), "New Model");

    const [, front, back, side] = fileInputs();
    await user.upload(front, png("front.png"));
    await user.upload(back, png("back.png"));
    await user.upload(side, png("side.png"));

    await waitFor(() => expect(uploadImage).toHaveBeenCalledTimes(3));

    const addButton = screen.getByRole("button", { name: "Add" });
    await waitFor(() => expect(addButton).toBeEnabled());
    await user.click(addButton);

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1));
    expect(onAdd).toHaveBeenCalledWith({
      name: "New Model",
      gender: "female", // default
      profilePicture: "https://cdn.example.com/uploaded.jpg",
      photos: {
        front: "https://cdn.example.com/uploaded.jpg",
        back: "https://cdn.example.com/uploaded.jpg",
        side: "https://cdn.example.com/uploaded.jpg",
      },
      isCustom: true,
    });
  });

  it("switches gender via the toggle before saving", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockResolvedValue(undefined);
    renderModal({ onAdd });

    await user.click(screen.getByRole("button", { name: /add model/i }));
    await user.type(screen.getByPlaceholderText("Model name"), "Guy");
    await user.click(screen.getByRole("button", { name: "Male" }));

    const [, front, back, side] = fileInputs();
    await user.upload(front, png("front.png"));
    await user.upload(back, png("back.png"));
    await user.upload(side, png("side.png"));

    const addButton = screen.getByRole("button", { name: "Add" });
    await waitFor(() => expect(addButton).toBeEnabled());
    await user.click(addButton);

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1));
    expect(onAdd.mock.calls[0][0]).toMatchObject({ gender: "male" });
  });

  it("shows an error message when saving fails and stays on the form", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockRejectedValue(new Error("Backend exploded"));
    renderModal({ onAdd });

    await user.click(screen.getByRole("button", { name: /add model/i }));
    await user.type(screen.getByPlaceholderText("Model name"), "New Model");

    const [, front, back, side] = fileInputs();
    await user.upload(front, png("front.png"));
    await user.upload(back, png("back.png"));
    await user.upload(side, png("side.png"));

    const addButton = screen.getByRole("button", { name: "Add" });
    await waitFor(() => expect(addButton).toBeEnabled());
    await user.click(addButton);

    expect(await screen.findByText("Backend exploded")).toBeInTheDocument();
    // Still on the form (name field present), not back on the list.
    expect(screen.getByPlaceholderText("Model name")).toBeInTheDocument();
  });
});

describe("ModelManagementModal — edit form", () => {
  it("prefills the form and submits changes through onUpdate", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    renderModal({
      models: [
        makeModel({
          id: 3,
          name: "Patrick",
          gender: "male",
          profilePicture: "f.jpg",
          photos: { front: "f.jpg", back: "b.jpg", side: "s.jpg" },
        }),
      ],
      onUpdate,
    });

    await user.click(screen.getByTitle("Edit"));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Edit model")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(
      "Model name",
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Patrick");

    await user.clear(nameInput);
    await user.type(nameInput, "Patrick Updated");

    const saveButton = screen.getByRole("button", { name: "Save" });
    await waitFor(() => expect(saveButton).toBeEnabled());
    await user.click(saveButton);

    await waitFor(() => expect(onUpdate).toHaveBeenCalledTimes(1));
    expect(onUpdate).toHaveBeenCalledWith(3, {
      name: "Patrick Updated",
      gender: "male",
      profilePicture: "f.jpg",
      photos: { front: "f.jpg", back: "b.jpg", side: "s.jpg" },
    });
  });
});
