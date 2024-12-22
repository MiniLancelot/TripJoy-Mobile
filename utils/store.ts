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

export { useTabStore, useChatStore };
