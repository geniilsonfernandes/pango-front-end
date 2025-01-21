import { create } from 'zustand';

type ModalKey = 'auth' | 'settings' | 'profile' | 'custom'; // Adicione os nomes dos modais aqui.

type ModalState = {
  modals: Record<ModalKey, boolean>;
  modalProps: Record<ModalKey, Record<string, any>>;
  openModal: (key: ModalKey, props?: Record<string, any>) => void;
  closeModal: (key: ModalKey) => void;
  closeAllModals: () => void;
};

const useModalStore = create<ModalState>((set) => ({
  modals: {
    auth: false,
    settings: false,
    profile: false,
    custom: false,
  },
  modalProps: {
    auth: {},
    settings: {},
    profile: {},
    custom: {},
  },
  openModal: (key, props = {}) =>
    set((state) => ({
      modals: { ...state.modals, [key]: true },
      modalProps: { ...state.modalProps, [key]: props },
    })),
  closeModal: (key) =>
    set((state) => ({
      modals: { ...state.modals, [key]: false },
      modalProps: { ...state.modalProps, [key]: {} },
    })),
  closeAllModals: () =>
    set(() => ({
      modals: {
        auth: false,
        settings: false,
        profile: false,
        custom: false,
      },
      modalProps: {
        auth: {},
        settings: {},
        profile: {},
        custom: {},
      },
    })),
}));

export default useModalStore;
