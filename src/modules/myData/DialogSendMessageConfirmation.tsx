import { LOCAL_STORAGE_PREFIX } from '@/config/config';
import { useState } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useSendMessageStore } from '@/stores/useSendMessage.store';

export default function DialogSendMessageConfirmation() {
  const [isSendMessageConfirmationOpen, setIsSendMessageConfirmationOpen] =
    useState(true);
  const { lastRecipient, setLastRecipient, isMessageSend, setIsMessageSend } =
    useSendMessageStore();

  const [isDialogSendMessageViewed, setDialogSendMessageViewed] =
    useLocalStorageState(`${LOCAL_STORAGE_PREFIX}_setDialogSendMessageViewed`, {
      defaultValue: false,
    });

  if (!lastRecipient || isDialogSendMessageViewed) {
    if (isMessageSend) {
      toast({
        title: `You successfully sent a message.`,
        variant: 'success',
      });
      setIsMessageSend(false);
    }
    return null;
  }

  return (
    <Dialog
      open={isSendMessageConfirmationOpen}
      onOpenChange={(openState) => {
        setIsSendMessageConfirmationOpen(openState);
        if (!openState) {
          setDialogSendMessageViewed(true);
          setLastRecipient('');
        }
      }}
    >
      <DialogContent>
        <DialogTitle>
          <p className="mt-3 text-lg">
            Your message has been successfully sent
          </p>
        </DialogTitle>
        <div className="mt-4 space-y-2">
          <p>
            Your message has been sent to: <span>{lastRecipient}</span>
          </p>
          <p>
            <b>Are you looking for Privacy Preserving Communication ?</b>
            <br />
            Explore the possibilities to integrate Confidential Web3 Messaging.
          </p>
        </div>
        <DialogFooter>
          <Button asChild className="mx-auto w-full max-w-44">
            <a
              href="http://airtable.com/appDiKrXe5wJgGpdP/pagm2GF2eNdX2ysw3/form"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect with us
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
