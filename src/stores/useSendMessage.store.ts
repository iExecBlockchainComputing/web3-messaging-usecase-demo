import { create } from 'zustand';

type SendMessageState = {
  lastRecipient: string;
  setLastRecipient: (param: string) => void;
  isMessageSend: boolean;
  setIsMessageSend: (param: boolean) => void;
};

export const useSendMessageStore = create<SendMessageState>((set) => ({
  lastRecipient: '',
  setLastRecipient: (sendMessage: string) =>
    set({ lastRecipient: sendMessage }),
  isMessageSend: false,
  setIsMessageSend: (isMessageSend: boolean) =>
    set({ isMessageSend: isMessageSend }),
}));
