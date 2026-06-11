import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useModels } from "./useModels";
import type { Model } from "@/types/types";

const getModels = vi.fn();
const createModel = vi.fn();
const updateModel = vi.fn();
const deleteModel = vi.fn();

vi.mock("@/service/model/modelService", () => ({
  default: {
    getModels: () => getModels(),
    createModel: (m: unknown) => createModel(m),
    updateModel: (id: number, m: unknown) => updateModel(id, m),
    deleteModel: (id: number) => deleteModel(id),
  },
}));

function model(overrides: Partial<Model> = {}): Model {
  return {
    id: 1,
    name: "Patrick",
    profilePicture: "p.jpg",
    gender: "male",
    selected: false,
    photos: { front: "f.jpg", back: "b.jpg", side: "s.jpg" },
    ...overrides,
  };
}

beforeEach(() => {
  getModels.mockReset().mockResolvedValue([]);
  createModel.mockReset().mockResolvedValue(undefined);
  updateModel.mockReset().mockResolvedValue(undefined);
  deleteModel.mockReset().mockResolvedValue(undefined);
});

describe("useModels", () => {
  it("loads models on mount and clears the loading flag", async () => {
    getModels.mockResolvedValue([model({ id: 1, name: "Patrick" })]);
    const { result } = renderHook(() => useModels());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.models).toHaveLength(1);
    expect(result.current.models[0].name).toBe("Patrick");
    expect(result.current.error).toBeNull();
  });

  it("records an error message when the fetch fails", async () => {
    getModels.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useModels());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("boom");
  });

  it("toggles a model on and off and exposes the selection", async () => {
    getModels.mockResolvedValue([model({ id: 1, gender: "male" })]);
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.toggleModel(1));
    expect(result.current.selectedModels.map((m) => m.id)).toEqual([1]);
    expect(result.current.selectedGender).toBe("male");

    act(() => result.current.toggleModel(1));
    expect(result.current.selectedModels).toHaveLength(0);
    expect(result.current.selectedGender).toBeNull();
  });

  it("refuses to select a model of a different gender than the active selection", async () => {
    getModels.mockResolvedValue([
      model({ id: 1, gender: "male" }),
      model({ id: 2, gender: "female" }),
    ]);
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.toggleModel(1));
    act(() => result.current.toggleModel(2));

    expect(result.current.selectedModels.map((m) => m.id)).toEqual([1]);
  });

  it("creates a model and refetches while preserving the current selection", async () => {
    getModels.mockResolvedValueOnce([model({ id: 1, gender: "male" })]);
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.toggleModel(1));

    getModels.mockResolvedValueOnce([
      model({ id: 1, gender: "male" }),
      model({ id: 2, name: "New", gender: "male" }),
    ]);

    await act(async () => {
      await result.current.addModel({
        name: "New",
        gender: "male",
        profilePicture: "p.jpg",
        photos: { front: "f.jpg", back: "b.jpg", side: "s.jpg" },
      });
    });

    expect(createModel).toHaveBeenCalledTimes(1);
    expect(result.current.models).toHaveLength(2);
    expect(result.current.selectedModels.map((m) => m.id)).toEqual([1]);
  });

  it("optimistically updates a model and reverts on failure", async () => {
    getModels.mockResolvedValue([model({ id: 1, name: "Patrick" })]);
    updateModel.mockRejectedValueOnce(new Error("nope"));
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.loading).toBe(false));

    getModels.mockResolvedValue([model({ id: 1, name: "Patrick" })]);

    await expect(
      act(async () => {
        await result.current.updateModel(1, { name: "Changed" });
      }),
    ).rejects.toThrow("nope");

    await waitFor(() => expect(result.current.models[0].name).toBe("Patrick"));
  });

  it("optimistically deletes a model and restores it on failure", async () => {
    getModels.mockResolvedValue([
      model({ id: 1, name: "Patrick" }),
      model({ id: 2, name: "Gaelle" }),
    ]);
    deleteModel.mockRejectedValueOnce(new Error("nope"));
    const { result } = renderHook(() => useModels());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(
      act(async () => {
        await result.current.deleteModel(1);
      }),
    ).rejects.toThrow("nope");

    expect(result.current.models.map((m: { id: any }) => m.id).sort()).toEqual([
      1, 2,
    ]);
  });
});
