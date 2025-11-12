import { LOCAL_STORAGE_PREFIX } from '@/config/config';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import step1 from '@/assets/onboarding-popup/step_1.png';
import step2 from '@/assets/onboarding-popup/step_2.png';
import step3 from '@/assets/onboarding-popup/step_3.png';
import step4 from '@/assets/onboarding-popup/step_4.png';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog.tsx';
import { cn } from '@/utils/style.utils.ts';

const steps = [
  {
    image: step1,
    title: 'Welcome to Web3 Messaging',
    description:
      'Experience how Web3Mail and Web3Telegram let you send and receive messages without ever revealing your contact info to the sender.',
  },
  {
    image: step2,
    title: 'Create a protected data',
    description:
      'Experience how Web3Mail and Web3Telegram let you send and receive messages without ever revealing your contact info to the sender.',
  },
  {
    image: step3,
    title: 'Manage Access',
    description:
      'Decide who can access your protected data. Set permissions, grant or revoke access, and ensure only the right person can use your data.',
  },
  {
    image: step4,
    title: 'Send a message',
    description:
      'Use Web3Mail or Web3Telegram to send messages without knowing your contact details.',
  },
];

function StepContent({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid w-full gap-2 text-center">
      <div className="bg-grey-800 relative mb-3 aspect-[20/9] overflow-hidden rounded-lg">
        <span className="absolute top-1/2 left-1/2 aspect-[0.77] w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00115C]/70 blur-3xl" />
        <span className="absolute right-0 aspect-square w-1/3 translate-x-1/6 -translate-y-1/2 rounded-full bg-[#FFE0BD]/40 blur-3xl" />
        <span className="absolute bottom-0 left-1/2 aspect-square w-1/3 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#BC70FD]/40 blur-3xl" />
        <img
          className="relative z-10 mx-auto mt-auto h-full"
          src={image}
          alt=""
        />
      </div>
      <h4 className="text-xl font-bold text-balance">{title}</h4>
      <p className="text-sm">{description}</p>
    </div>
  );
}

export default function OnboardingPopup() {
  const [step, setStep] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(true);
  const navigate = useNavigate();

  const [isStorageOnboardingViewed, setStorageOnboardingViewed] =
    useLocalStorageState(`${LOCAL_STORAGE_PREFIX}_onboardingViewed`, {
      defaultValue: false,
    });

  const onPopupOpenChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
        setStorageOnboardingViewed(true);
        navigate('/my-data');
      }
    },
    [navigate, setStorageOnboardingViewed]
  );

  useEffect(() => {
    if (step === steps.length) {
      const timer = setTimeout(() => {
        onPopupOpenChange(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [step, onPopupOpenChange]);

  if (isStorageOnboardingViewed) {
    return false;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={onPopupOpenChange}>
      <DialogContent hideCloseButton className="px-7 py-6">
        <DialogTitle></DialogTitle>
        <div className="flex flex-col items-center gap-6">
          <StepContent {...steps[step]} />
          <div className="flex gap-4">
            <div className="flex">
              {Array.from({ length: steps.length }).map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    'before:bg-grey-400 relative -my-2 size-6 before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full',
                    step === index && 'before:bg-primary'
                  )}
                  onClick={() => setStep(index)}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            {step !== steps.length - 1 && (
              <Button
                onClick={() => onPopupOpenChange(false)}
                className="mx-auto"
                variant="text"
              >
                Skip
              </Button>
            )}
            <Button
              onClick={() => setStep(step + 1)}
              className="mx-auto"
              autoFocus
            >
              {step === steps.length - 1 ? 'Start Earning' : 'Next'}
              <ArrowRight />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
