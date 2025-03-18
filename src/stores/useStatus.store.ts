import { create } from 'zustand';

type OneStatus = {
  title: string;
  isDone?: boolean;
  isError?: boolean;
  payload?: Record<string, string>;
};

type StatusState = {
  statuses: Record<
    string,
    { isDone?: boolean; isError?: boolean; payload?: Record<string, string> }
  >;
  addOrUpdateStatusToStore: (status: OneStatus) => void;
  resetStatuses: () => void;
};

const useStatusStore = create<StatusState>((set) => ({
  statuses: {},
  addOrUpdateStatusToStore: (status) =>
    set((state) => ({
      statuses: {
        ...state.statuses,
        [status.title]: {
          isDone: status.isDone,
          isError: status.isError ?? false,
          payload: status.payload,
        },
      },
    })),
  resetStatuses: () => set({ statuses: {} }),
}));

export default useStatusStore;