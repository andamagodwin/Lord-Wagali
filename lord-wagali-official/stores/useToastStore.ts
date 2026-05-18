import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastState {
  visible: boolean;
  title: string;
  message: string;
  variant: ToastVariant;
  showToast: (input: { title: string; message: string; variant?: ToastVariant }) => void;
  hideToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  title: '',
  message: '',
  variant: 'info',
  showToast: ({ title, message, variant = 'info' }) => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    set({ visible: true, title, message, variant });

    toastTimer = setTimeout(() => {
      set({ visible: false });
    }, 3200);
  },
  hideToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    set({ visible: false });
  },
}));
