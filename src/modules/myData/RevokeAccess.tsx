import { GrantedAccess } from '@iexec/dataprotector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';

export default function RevokeAccess({
  grantAccess,
}: {
  grantAccess: GrantedAccess;
}) {
  const { address: userAddress, chainId } = useUserStore();
  const queryClient = useQueryClient();

  const revokeAccessMutation = useMutation({
    mutationFn: async () => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      const revokeAccess = await dataProtectorCore.revokeOneAccess(grantAccess);

      return revokeAccess;
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: (grantAccess) => {
      queryClient.invalidateQueries({
        queryKey: [
          'granted access',
          grantAccess.access.dataset,
          userAddress,
          chainId,
        ],
      });
      toast({
        title: `You have successfully revoke access to ${grantAccess.access.requesterrestrict}`,
        variant: 'success',
      });
    },
  });

  return (
    <Button
      variant="outline"
      isLoading={revokeAccessMutation.isPending}
      onClick={() => {
        revokeAccessMutation.mutate();
      }}
    >
      Revoke access
    </Button>
  );
}
