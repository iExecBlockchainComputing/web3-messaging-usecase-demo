import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog.tsx';

export default function GrantAccessModal({
  isSwitchingModalOpen,
  setSwitchingModalOpen,
}: {
  isSwitchingModalOpen: boolean;
  setSwitchingModalOpen: (openState: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    userAddress: '',
    accessNumber: '',
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Dialog
      open={isSwitchingModalOpen}
      onOpenChange={(openState: boolean) => (
        setSwitchingModalOpen(openState),
        setFormData({ userAddress: '', accessNumber: '' })
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
              className="inline max-w-full justify-normal overflow-hidden text-ellipsis text-yellow-300"
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
            Authorize any user :{' '}
            <Button
              variant="text"
              size="none"
              className="inline max-w-full justify-normal overflow-hidden text-ellipsis text-yellow-300"
              onClick={() => {
                setFormData((prevData) => ({
                  ...prevData,
                  userAddress: '0xa55513ac50fa0198c7fcd14f284229ddb8d357e6',
                }));
              }}
            >
              0xa55513ac50fa0198c7fcd14f284229ddb8d357e6
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
        </form>
        <DialogFooter className="mt-2 flex !justify-center gap-5">
          <Button
            variant="outline"
            onClick={() => setSwitchingModalOpen(false)}
          >
            Cancel
          </Button>
          <Button>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
