// stores/useFormStore.ts
import { Province } from '@/constants/Provinces';
import { create } from 'zustand';

interface FormState {
  provinceStart: Province;
  provinceEnd: Province;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  vehicle: string;
  setFormData: (key: keyof FormState, value: any) => void;
  resetForm: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  provinceStart: {
    provinceId: "",
    provinceName: "",
  },
  provinceEnd: {
    provinceId: "",
    provinceName: "",
  },
  startDate: '',
  endDate: '',
  estimatedBudget: 0,
  vehicle: '',
  setFormData: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),
  resetForm: () =>
    set({
      provinceStart: {
        provinceId: "",
        provinceName: "",
      },
      provinceEnd: {
        provinceId: "",
        provinceName: "",
      },
      startDate: '',
      endDate: '',
      estimatedBudget: 0,
      vehicle: '',
    }),
}));
