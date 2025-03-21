import { WEB3MAIL_IDAPPS_WHITELIST_SC } from '@/config/config';
import { Address } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog.tsx';
import { toast } from '@/components/ui/use-toast';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';

export default function GrantAccessModal({
  isSwitchingModalOpen,
  setSwitchingModalOpen,
  protectedDataAddress,
}: {
  isSwitchingModalOpen: boolean;
  setSwitchingModalOpen: (openState: boolean) => void;
  protectedDataAddress: Address;
}) {
  const { address: userAddress } = useUserStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    userAddress: '',
    accessNumber: undefined,
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateFormData = () => {
    if (!formData.userAddress) {
      return 'Please enter a user address';
    }
    if (!formData.accessNumber) {
      return 'Please enter a number of access';
    }
    return null;
  };

  const handleGrantAccess = async () => {
    const errorMessage = validateFormData();
    if (errorMessage) {
      toast({ variant: 'danger', title: 'Error', description: errorMessage });
      throw new Error(errorMessage);
    } else {
      grantAccessMutation.mutate();
    }
  };

  const grantAccessMutation = useMutation({
    mutationKey: ['grantAccess', protectedDataAddress],
    mutationFn: async () => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      const grantedAccess = await dataProtectorCore.grantAccess({
        protectedData: protectedDataAddress,
        authorizedUser: formData.userAddress,
        authorizedApp: WEB3MAIL_IDAPPS_WHITELIST_SC,
        pricePerAccess: 0,
        numberOfAccess: formData.accessNumber,
      });

      return grantedAccess;
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['granted access', protectedDataAddress, userAddress],
      });
      navigate(`/my-data/protected-data/${protectedDataAddress}`);
      toast({
        title: 'You have successfully authorized a new user.',
        variant: 'success',
      });
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({ userAddress: '', accessNumber: undefined });
  };

  return (
    <Dialog
      open={isSwitchingModalOpen}
      onOpenChange={(openState: boolean) => (
        setSwitchingModalOpen(openState), resetForm()
      )}
    >
      <DialogContent>
        <DialogTitle>
          <p className="mt-3 text-lg">New user</p>
        </DialogTitle>
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleGrantAccess();
          }}
        >
          <div className="grid gap-2">
            <label htmlFor="user_address">User Address *</label>
            <input
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              placeholder="0x0000000000000000000000000000000000000000"
              className="focus:border-primary border-grey-300 rounded-lg border bg-transparent p-3 transition duration-200 focus:outline-none"
              type="text"
              minLength={42}
              maxLength={42}
              id="user_address"
            />
          </div>
          <div>
            Authorize any user :{' '}
            <Button
              variant="text"
              size="none"
              className="inline max-w-full justify-normal overflow-hidden text-base text-ellipsis text-yellow-300"
              onClick={() => {
                setFormData((prevData) => ({
                  ...prevData,
                  userAddress: '0x0000000000000000000000000000000000000000',
                }));
              }}
            >
              0x0000000000000000000000000000000000000000
            </Button>
          </div>
          <div>
            Authorize myself :{' '}
            <Button
              variant="text"
              size="none"
              className="inline max-w-full justify-normal overflow-hidden text-base text-ellipsis text-yellow-300"
              onClick={() => {
                setFormData((prevData) => ({
                  ...prevData,
                  userAddress: userAddress || '',
                }));
              }}
            >
              {userAddress}
            </Button>
          </div>
          <div className="grid gap-2">
            <label htmlFor="access_number">Number of Access*</label>
            <input
              name="accessNumber"
              onChange={handleChange}
              placeholder="100"
              className="focus:border-primary border-grey-300 rounded-lg border bg-transparent p-3 transition duration-200 focus:outline-none"
              type="number"
              id="access_number"
            />
          </div>
          {/* <div className="flex w-full max-w-[550px] flex-col gap-y-0.5 text-sm">
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
          </div> */}
          {grantAccessMutation.isError &&
          grantAccessMutation.error.message === 'Failed to sign data access' &&
          !(grantAccessMutation.error.cause as Error).message.startsWith(
            'ethers-user-denied'
          ) ? (
            <Alert variant="error">
              <p>Oops, something went wrong while adding an authorized user.</p>
              <p>
                {grantAccessMutation.error.cause
                  ? grantAccessMutation.error.cause.toString()
                  : grantAccessMutation.error.toString()}
              </p>
              <p>
                Are you sure your protected data was created in the same
                environment?'
              </p>
            </Alert>
          ) : (
            grantAccessMutation.isError && (
              <Alert variant="error">

                <p>
                  Oops, something went wrong while adding an authorized user.
                </p>
                <p>
                  {grantAccessMutation.error.cause
                    ? grantAccessMutation.error.cause.message.toString()
                    : grantAccessMutation.error.toString()}
                </p>
              </Alert>
            )
          )}
          <div className="mt-2 flex justify-center gap-5">
            <Button
              variant="outline"
              onClick={() => setSwitchingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={grantAccessMutation.isPending}>
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
