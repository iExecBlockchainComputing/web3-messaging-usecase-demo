import {
  WEB3MAIL_IDAPPS_WHITELIST_SC,
  WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
} from '@/config/config';
import { ProtectedData } from '@iexec/dataprotector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { DocLink } from '@/components/DocLink';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog.tsx';
import { toast } from '@/components/ui/use-toast';
import { getDataProtectorCoreClient } from '@/externals/iexecSdkClient';
import useUserStore from '@/stores/useUser.store';

export default function GrantAccessModal({
  isSwitchingModalOpen,
  setSwitchingModalOpen,
  protectedData,
}: {
  isSwitchingModalOpen: boolean;
  setSwitchingModalOpen: (openState: boolean) => void;
  protectedData: ProtectedData;
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const getDataType = (schema: { [key: string]: unknown }) => {
    if (schema.email) {
      return 'mail';
    }
    if (schema.telegram_chatId || schema.chatId) {
      return 'telegram';
    }
    return 'other';
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
    mutationKey: ['grantAccess', protectedData.address, formData.userAddress],
    mutationFn: async () => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      const grantedAccess = await dataProtectorCore.grantAccess({
        protectedData: protectedData.address,
        authorizedUser: formData.userAddress,
        authorizedApp:
          getDataType(protectedData.schema) === 'mail'
            ? WEB3MAIL_IDAPPS_WHITELIST_SC
            : WEB3TELEGRAM_IDAPPS_WHITELIST_SC,
        numberOfAccess: formData.accessNumber,
      });

      return grantedAccess;
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['granted access', protectedData.address, userAddress],
      });
      navigate(`/my-data/${protectedData.address}`);
      toast({
        title: 'You have successfully authorized a new user.',
        variant: 'success',
      });
      setSwitchingModalOpen(false);
    },
  });

  const resetForm = () => {
    setFormData({ userAddress: '', accessNumber: undefined });
  };

  return (
    <Dialog
      open={isSwitchingModalOpen}
      onOpenChange={(openState) => {
        setSwitchingModalOpen(openState);
        resetForm();
      }}
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
          {grantAccessMutation.isError && (
            <Alert variant="error">
              <p>Oops, something went wrong while adding an authorized user.</p>
              <p>
                {grantAccessMutation.error.cause
                  ? (
                      grantAccessMutation.error.cause as Error
                    ).message.toString()
                  : grantAccessMutation.error.toString()}
              </p>
              {grantAccessMutation.error.message ===
                'Failed to sign data access' &&
                !(grantAccessMutation.error.cause as Error).message.startsWith(
                  'ethers-user-denied'
                ) && (
                  <p>
                    Are you sure your protected data was created in the same
                    environment?
                  </p>
                )}
            </Alert>
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
          <DocLink className="bg-grey-600 border-grey-500">
            dataprotector-sdk / Method called:{' '}
            <a
              href="https://tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/grantAccess"
              target="_blank"
              rel="noreferrer"
              className="text-primary whitespace-pre hover:underline"
            >
              <br />
              grantAccess({'{'}
              <br />
              {'  '}protectedData: "{protectedData.address}",
              <br />
              {'  '}authorizedUser: "
              {formData.userAddress ? formData.userAddress : 'undefined'}",
              <br />
              {'  '}authorizedApp: "
              {getDataType(protectedData.schema) === 'mail'
                ? WEB3MAIL_IDAPPS_WHITELIST_SC
                : WEB3TELEGRAM_IDAPPS_WHITELIST_SC}
              " ,
              <br />
              {'  '}numberOfAccess: "
              {formData.accessNumber ? formData.accessNumber : 'undefined'},"
              <br />
              {'}'});
            </a>
          </DocLink>
        </form>
      </DialogContent>
    </Dialog>
  );
}
