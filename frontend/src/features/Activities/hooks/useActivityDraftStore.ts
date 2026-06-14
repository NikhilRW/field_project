import { create } from "zustand";
import type { ActivityStatus } from "@/shared/types/mock";

type ActivityDraftState = {
  name: string;
  date: Date | null;

  description: string;
  status: ActivityStatus;
  setName: (name: string) => void;
  setDate: (date: Date | null) => void;

  setDescription: (description: string) => void;
  setStatus: (status: ActivityStatus) => void;
  resetDraft: () => void;
};

// TODO: put it in separate store folder
export const useActivityDraftStore = create<ActivityDraftState>((set) => ({
  name: "",
  date: null,
  description: "",
  status: "Upcoming",
  setName: (name) => set({ name }),
  setDate: (date) => set({ date }),
  setDescription: (description) => set({ description }),
  setStatus: (status) => set({ status }),
  resetDraft: () =>
    set({
      name: "",
      date: null,
      description: "",
      status: "Upcoming",
    }),
}));
