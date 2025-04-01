import { OneProtectDataStatus } from '@iexec/dataprotector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { JSX, useEffect, useState } from 'react';
import { ArrowRight, Info, Mail, User } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { DocLink } from '@/components/DocLink';
import { Stepper } from '@/components/Stepper';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import StatusMessage from '@/modules/myData/StatusMessage';
import useStatusStore from '@/stores/useStatus.store';
import useUserStore from '@/stores/useUser.store';
import { getUserFriendlyStatues } from '@/utils/getUserFriendlyStatues';
import { cn } from '@/utils/style.utils';

const COLOR_CLASSES: {
  [key: string]: {
    gradientTo: string;
    dataReadableType: string;
    icon: JSX.Element;
  };
} = {
  mail: {
    gradientTo: 'after:to-[#50366b]',
    dataReadableType: 'Email address',
    icon: <Mail size={20} />,
  },
  telegram: {
    gradientTo: 'after:to-[#00115C]',
    dataReadableType: 'Telegram ChatId',
    icon: <User size={20} />,
  },
};

export default function AddProtectedData() {
  const { address: userAddress } = useUserStore();
  const { statuses, addOrUpdateStatusToStore, resetStatuses } =
    useStatusStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    dataType: '',
    encryptedDataContent: '',
    encryptedDataName: '',
  });

  const updateStep = (step: number) => {
    navigate(`${location.pathname}?step=${step}`);
    setCurrentStep(step);
  };

  useEffect(() => {
    const stepFromURL = parseInt(
      new URLSearchParams(location.search).get('step') ?? '0',
      10
    );
    if (!formData.dataType && stepFromURL !== 0) {
      updateStep(0);
    } else {
      setCurrentStep(stepFromURL);
    }
  }, [location.search]);

  const validateFormData = () => {
    if (currentStep === 0 && !formData.dataType) {
      return 'Please select a data type';
    }
    if (currentStep === 1 && !formData.encryptedDataContent) {
      return formData.dataType === 'mail'
        ? 'Please enter an email address'
        : 'Please enter a telegram chatId';
    }
    if (currentStep === 2 && !formData.encryptedDataName) {
      return formData.dataType === 'mail'
        ? 'Please name your protected email address'
        : 'Please name your protected telegram chatId';
    }
    return null;
  };

  const handleBackClick = () => {
    if (currentStep === 0) {
      navigate('/my-data');
    } else {
      updateStep(currentStep - 1);
    }
  };

  const handleNextClick = async () => {
    const errorMessage = validateFormData();
    if (errorMessage) {
      toast({ variant: 'danger', title: 'Error', description: errorMessage });
      return;
    }

    if (currentStep === 2) {
      CreateProtectedDataMutation.mutate(formData.dataType === 'mail');
    } else {
      updateStep(currentStep + 1);
    }
  };

  const CreateProtectedDataMutation = useMutation({
    mutationKey: ['protectData', userAddress],
    mutationFn: async (isMail: boolean) => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      const key = isMail ? 'email' : 'telegram_chatId';

      const protectedData = await dataProtectorCore.protectData({
        data: {
          [key]: formData.encryptedDataContent,
        },
        name: formData.encryptedDataName,
        onStatusUpdate: (status) => {
          console.log();
          keepInterestingStatusUpdates(addOrUpdateStatusToStore, status);
        },
      });
      return protectedData;
    },
    onError: () => {
      resetStatuses();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['apps', userAddress],
      });
      navigate('/my-data');
      toast({
        title: 'You have successfully add a new protected data.',
        variant: 'success',
      });
      resetStatuses();
    },
  });

  type CreateProtectedDataStatusUpdateFn = (params: {
    title: string;
    isDone: boolean;
    payload?: Record<string, string>;
  }) => void;

  function keepInterestingStatusUpdates(
    onStatusUpdate: CreateProtectedDataStatusUpdateFn,
    status: OneProtectDataStatus
  ) {
    const title = getUserFriendlyStatues(status.title);
    if (title !== 'Unknown status') {
      onStatusUpdate({
        title,
        isDone: status.isDone ?? false,
      });
    }
  }

  return (
    <div className="grid gap-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-center sm:text-left">Protect new data</h1>
        <p>
          Protect new email or telegram: encrypt, monetize and control access.
        </p>
      </div>
      <Stepper
        currentStep={currentStep}
        steps={['Select data type', 'Your data', 'Name your data']}
      />
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Select your data type</h2>
        <form
          className="mt-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleNextClick();
          }}
        >
          {currentStep === 0 &&
            Object.keys(COLOR_CLASSES).map((key) => (
              <label
                key={key}
                htmlFor={key}
                className={cn(
                  'radial-bg rounded-20 relative z-0 flex cursor-pointer flex-col gap-6 overflow-hidden p-8 duration-300',
                  'before:bg-grey-800 has-checked:before:bg-grey-800/30 before:absolute before:inset-px before:z-20 before:rounded-[calc(20px-1px)] before:duration-300 hover:before:bg-transparent has-focus:before:bg-transparent',
                  'after:from-grey-800 after:absolute after:inset-px after:-z-10 after:rounded-[calc(20px-1px)] after:bg-gradient-to-br after:from-50%',
                  COLOR_CLASSES[key].gradientTo
                )}
              >
                <input
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      dataType: e.target.value,
                    }));
                  }}
                  className="absolute -z-10"
                  type="radio"
                  name="dataType"
                  value={key}
                  checked={key === formData.dataType}
                  id={key}
                />
                <div className="z-30 grid gap-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-yellow-300/10 p-2.5 text-yellow-300">
                      {COLOR_CLASSES[key].icon}
                    </div>
                    <p className="font-anybody capitalize">{key}</p>
                  </div>
                  <p>{COLOR_CLASSES[key].dataReadableType}</p>
                </div>
              </label>
            ))}
          {currentStep === 1 && formData.dataType === 'mail' && (
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="email_address">Email Address *</label>
              <input
                onChange={(e) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    encryptedDataContent: e.target.value,
                  }));
                }}
                placeholder="email@example.com"
                className="focus:border-primary border-grey-300 mt-2 max-w-xl rounded-lg border bg-transparent p-3 transition duration-200 focus:outline-none"
                type="email"
                id="email_address"
              />
            </div>
          )}
          {currentStep === 1 && formData.dataType === 'telegram' && (
            <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
              <div className="grid gap-2">
                <label htmlFor="telegram_chat_id">Telegram Chat Id *</label>
                <input
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      encryptedDataContent: e.target.value,
                    }));
                  }}
                  minLength={9}
                  maxLength={10}
                  placeholder="012345678"
                  className="focus:border-primary border-grey-300 mt-2 max-w-xl rounded-lg border bg-transparent p-3 transition duration-200 focus:outline-none"
                  type="text"
                  id="telegram_chat_id"
                />
              </div>
              <div className="mt-4 grid gap-4 rounded-3xl border border-[#00115C] bg-[#00115C]/20 px-10 py-6">
                <div className="flex items-center gap-4">
                  <span className="rounded-lg bg-[#00115C] p-2.5">
                    <Info size="20" />
                  </span>
                  <h3 className="font-anybody font-extrabold">Information</h3>
                </div>
                <div>
                  <p>
                    Initiate a conversation with the bot{' '}
                    <Button asChild variant="text" size="none">
                      <a
                        href="https://t.me/IExecWeb3TelegramBot"
                        target="_blank"
                        className="underline"
                        rel="noopener noreferrer"
                      >
                        @IExecWeb3TelegramBot
                      </a>
                    </Button>{' '}
                    to get your Chat ID and receive messages.
                  </p>
                  <p>
                    Once open, copy your chat ID and paste it in the Telegram
                    Chat ID above.
                  </p>
                </div>
                <Button
                  variant="text"
                  size="none"
                  className="group ml-auto w-fit text-lg font-bold"
                >
                  {' '}
                  Learn more about chat id{' '}
                  <ArrowRight
                    size="20"
                    className="duration-300 group-hover:translate-x-1"
                  />
                </Button>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="grid gap-2 sm:col-span-2 lg:col-span-3">
              <div className="grid gap-2">
                <label htmlFor="protected_data_name">
                  Name of your Protected Data *
                </label>
                <input
                  onChange={(e) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      encryptedDataName: e.target.value,
                    }));
                  }}
                  placeholder={
                    formData.dataType === 'mail'
                      ? 'Ex: Antoine Wallet email address'
                      : 'Ex: Antoine Wallet telegram'
                  }
                  className="focus:border-primary border-grey-300 mt-2 max-w-xl rounded-lg border bg-transparent p-3 transition duration-200 focus:outline-none"
                  type="text"
                  id="protected_data_name"
                />
              </div>
              <div className="flex w-full max-w-[550px] flex-col gap-y-0.5 text-sm">
                {Object.keys(statuses).length > 0 && (
                  <div className="mt-6">
                    {Object.entries(statuses).map(
                      ([message, { isDone, isError }]) => (
                        <StatusMessage
                          key={message}
                          message={message}
                          isDone={isDone}
                          isError={isError}
                        />
                      )
                    )}
                  </div>
                )}
              </div>
              {CreateProtectedDataMutation.isError && (
                <Alert variant="error">
                  <p>Oops, something went wrong while fetching all creators.</p>
                  <p>{CreateProtectedDataMutation.error.toString()}</p>
                </Alert>
              )}
            </div>
          )}
          <div className="mt-6 flex justify-center gap-4 sm:col-span-2 md:justify-end lg:col-span-3">
            <Button
              disabled={CreateProtectedDataMutation.isPending}
              onClick={handleBackClick}
              variant="outline"
              type="button"
            >
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </Button>
            <Button
              isLoading={CreateProtectedDataMutation.isPending}
              type="submit"
            >
              {currentStep >= 2 ? 'Create protected data' : 'Next'}
            </Button>
          </div>
        </form>
        <DocLink>
          dataprotector-sdk / Method called:{' '}
          <a
            href="https://tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/protectData"
            target="_blank"
            rel="noreferrer"
            className="text-primary whitespace-pre hover:underline"
          >
            <br />
            protectData({'{'}
            <br />
            {'  '}data: {'{'}
            <br />
            {'    '}
            {formData.dataType === 'mail'
              ? 'email'
              : formData.dataType === 'telegram'
                ? 'telegram_chatId'
                : 'undefined'}
            : "{formData.encryptedDataContent}",
            <br />
            {'  }'}
            <br />
            {'  '}name: {formData.encryptedDataName},
            <br />
            {'}'});
          </a>
        </DocLink>
      </div>
    </div>
  );
}
