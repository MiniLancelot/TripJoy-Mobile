import { create } from "zustand";

type TabStore = {
  sharedId: string | null;
  setSharedId: (id: string) => void;
};

type ChatStore = {
  userId: string;
  roomId: string;
  setUserId: (_userId: string) => void;
  setRoomId: (_roomId: string) => void;
};

// interface AiFormData {
//   provinceStart?: string;
//   provinceEnd?: string;
//   startDate?: string;
//   endDate?: string;
//   estimatedBudget?: number;
//   travelType?: 'alone' | 'friends';
//   vehicle?: string;
// }

// type AiFormStore = {
//   currentStep: number;
//   formData: AiFormData;
//   setFormData: (data: Partial<FormData>) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   resetForm: () => void;
// }

const useTabStore = create<TabStore>((set) => ({
  sharedId: null,
  setSharedId: (id: string) => set({ sharedId: id }),
}));

const useChatStore = create<ChatStore>((set) => ({
  userId: "",
  roomId: "",
  setUserId: (_userId: string) => set({ userId: _userId }),
  setRoomId: (_roomId: string) => set({ roomId: _roomId }),
}));

// const useAiFormStore = create<AiFormStore>((set) => ({
//   currentStep: 0,
//   qiformData: {},
//   setFormData: (data) =>
//     set((state) => ({ formData: { ...state.formData, ...data } })),
//   nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
//   prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
//   resetForm: () => set({ currentStep: 0, formData: {} }),
// }));

export { useTabStore, useChatStore };
