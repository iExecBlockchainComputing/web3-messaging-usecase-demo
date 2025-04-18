import { Address } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'react-feather';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';

export default function CheckSMSRequestSuccess({
  protectedDataAddress,
  className,
}: {
  className?: string;
  protectedDataAddress: Address | undefined;
}) {
  const {
    data: smsSecretExists,
    isSuccess: isSmsRequestSuccess,
    isError: isCheckSmsSecretError,
  } = useQuery({
    queryKey: ['oneProtectedDataSmsSecret', protectedDataAddress],
    queryFn: async () => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      // @ts-expect-error 'iexec' is a protected field but that's fine
      return dataProtectorCore.iexec.dataset.checkDatasetSecretExists(
        protectedDataAddress!
      );
    },
    enabled: !!protectedDataAddress,
  });

  return (
    <div className={className}>
      {isSmsRequestSuccess && !smsSecretExists && !isCheckSmsSecretError && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <AlertCircle size="24" className="text-red-400" />
            </TooltipTrigger>
            <TooltipContent side="left">
              This protected data is probably unusable as{' '}
              <strong>
                its secret encryption key was
                <br /> not found
              </strong>{' '}
              in the iExec Secret Management Service (SMS).
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
