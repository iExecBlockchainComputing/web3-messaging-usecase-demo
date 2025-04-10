import { Address } from '@/types';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@radix-ui/react-tooltip';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'react-feather';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';

export default function CheckSMSRequestSuccess({
  protectedDataAddress,
}: {
  protectedDataAddress: Address | undefined;
}) {
  const {
    data: hasSmsSecret,
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
    <>
      {isSmsRequestSuccess && !hasSmsSecret && !isCheckSmsSecretError && (
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
    </>
  );
}
