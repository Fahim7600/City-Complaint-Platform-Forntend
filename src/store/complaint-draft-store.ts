import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Priority } from "@/types/complaint";

export interface DraftCategory {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
}

export interface DraftDetails {
  title: string;
  description: string;
  priority: Priority;
}

export interface DraftLocation {
  address: string;
  lat?: number;
  lng?: number;
}

export interface ComplaintDraftState {
  currentStep: number;
  category: DraftCategory | null;
  details: DraftDetails;
  location: DraftLocation;
  // Files are kept in memory (File objects are not serializable to JSON)
  files: File[];
  filePreviews: { id: string; url: string; name: string; size: number; isPdf: boolean }[];

  setCurrentStep: (step: number) => void;
  setCategory: (category: DraftCategory) => void;
  setDetails: (details: Partial<DraftDetails>) => void;
  setLocation: (location: Partial<DraftLocation>) => void;
  addFiles: (newFiles: File[], maxCount: number) => void;
  removeFile: (index: number) => void;
  clearDraft: () => void;
}

const initialDetails: DraftDetails = {
  title: "",
  description: "",
  priority: Priority.MEDIUM,
};

const initialLocation: DraftLocation = {
  address: "",
};

export const useComplaintDraftStore = create<ComplaintDraftState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      category: null,
      details: initialDetails,
      location: initialLocation,
      files: [],
      filePreviews: [],

      setCurrentStep: (step) => set({ currentStep: step }),

      setCategory: (category) =>
        set({
          category,
        }),

      setDetails: (details) =>
        set((state) => ({
          details: { ...state.details, ...details },
        })),

      setLocation: (location) =>
        set((state) => ({
          location: { ...state.location, ...location },
        })),

      addFiles: (newFiles, maxCount) => {
        const state = get();
        const combined = [...state.files, ...newFiles].slice(0, maxCount);
        const previews = combined.map((file, idx) => {
          const isPdf = file.type === "application/pdf";
          return {
            id: `${file.name}-${file.size}-${idx}`,
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            isPdf,
          };
        });

        set({
          files: combined,
          filePreviews: previews,
        });
      },

      removeFile: (index) => {
        const state = get();
        const oldPreview = state.filePreviews[index];
        if (oldPreview?.url && oldPreview.url.startsWith("blob:")) {
          URL.revokeObjectURL(oldPreview.url);
        }

        const remainingFiles = state.files.filter((_, i) => i !== index);
        const remainingPreviews = state.filePreviews.filter((_, i) => i !== index);

        set({
          files: remainingFiles,
          filePreviews: remainingPreviews,
        });
      },

      clearDraft: () => {
        const state = get();
        // Revoke any created blob preview URLs
        for (const preview of state.filePreviews) {
          if (preview.url.startsWith("blob:")) {
            URL.revokeObjectURL(preview.url);
          }
        }

        set({
          currentStep: 1,
          category: null,
          details: initialDetails,
          location: initialLocation,
          files: [],
          filePreviews: [],
        });
      },
    }),
    {
      name: "cityfix_complaint_draft",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        category: state.category,
        details: state.details,
        location: state.location,
      }),
    }
  )
);
