import { WORKERPOOL_ADDRESS_OR_ENS } from '@/config/config';
import { Address } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert } from '@/components/Alert';
import { DocLink } from '@/components/DocLink';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  getDataProtectorCoreClient,
  getWeb3mailClient,
  getWeb3telegramClient,
} from '@/externals/iexecSdkClient';
import { pluralize } from '@/utils/pluralize';

export default function SendMessage() {
  const navigate = useNavigate();
  const { protectedDataAddress } = useParams<{
    protectedDataAddress: Address;
  }>();

  const [formData, setFormData] = useState({
    senderName: '',
    messageSubject: '',
    messageContent: '',
    contentType: 'text/plain',
  });

  const protectedData = useQuery({
    queryKey: ['protectedData', protectedDataAddress],
    queryFn: async () => {
      const dataProtectorCore = await getDataProtectorCoreClient();
      // TODO check protectedDataList before
      const protectedDatas = await dataProtectorCore.getProtectedData({
        protectedDataAddress: protectedDataAddress,
      });
      return protectedDatas[0];
    },
    enabled: !!protectedDataAddress,
    refetchOnWindowFocus: true,
  });

  const getDataType = (schema: { [key: string]: unknown }) => {
    if (schema.email) {
      return 'mail';
    }
    if (schema.telegramChatId || schema.chatId) {
      return 'telegram';
    }
    return 'other';
  };

  const isMail =
    protectedData.data?.schema &&
    getDataType(protectedData.data?.schema) === 'mail';

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFormData = () => {
    if (!formData.senderName) {
      return 'Please enter a sender name';
    }
    if (!formData.messageSubject && isMail) {
      return 'Please enter a message subject';
    }
    if (!formData.messageContent) {
      return 'Please enter a message';
    }
    return null;
  };

  const handleSendMessage = async () => {
    const errorMessage = validateFormData();
    if (errorMessage) {
      toast({ variant: 'danger', title: 'Error', description: errorMessage });
      throw new Error(errorMessage);
    } else {
      sendMessageMutation.mutate();
    }
  };

  const sendMessageMutation = useMutation({
    mutationKey: ['sendMessage', protectedDataAddress],
    mutationFn: async () => {
      if (isMail) {
        const web3mail = await getWeb3mailClient();

        const sendMail = await web3mail.sendEmail({
          protectedData: protectedDataAddress!,
          emailSubject: formData.messageSubject,
          senderName: formData.senderName,
          contentType: formData.contentType,
          emailContent: formData.messageContent,
          workerpoolAddressOrEns: WORKERPOOL_ADDRESS_OR_ENS,
        });
        return sendMail;
      } else {
        const web3telegram = await getWeb3telegramClient();

        const sendTelegram = await web3telegram.sendTelegram({
          protectedData: protectedDataAddress!,
          senderName: formData.senderName,
          telegramContent: formData.messageContent,
          workerpoolAddressOrEns: WORKERPOOL_ADDRESS_OR_ENS,
        });
        return sendTelegram;
      }
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      navigate('/contacts');
      toast({
        title: `You have successfully sent a ${
          protectedData.data?.schema
            ? getDataType(protectedData.data.schema)
            : 'unknown'
        }.`,
        variant: 'success',
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1>Send {isMail ? 'Email' : 'Telegram'}</h1>
        <p>
          Send {isMail ? 'email' : 'telegram'} to{' '}
          <span className="text-primary">{protectedDataAddress}</span>
        </p>
      </div>

      <form
        className="mt-4 flex max-w-2xl flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <div className="grid gap-2">
          <label htmlFor="sender_name">
            Sender name *{' '}
            <span className="text align-text-top text-xs">(min 3 chars)</span>
          </label>
          <input
            name="senderName"
            onChange={handleChange}
            disabled={sendMessageMutation.isPending}
            placeholder="Enter your full name"
            className="focus:border-primary border-grey-300 rounded-lg border bg-transparent p-3 transition duration-200 focus:outline-none"
            type="text"
            minLength={3}
            maxLength={20}
            id="sender_name"
          />
          <span className="text-grey-300 text-xs font-light italic">
            {pluralize(20 - formData.senderName.length, 'character')} remaining
          </span>
        </div>
        {isMail && (
          <div className="contents">
            <div className="grid gap-2">
              <label htmlFor="message_subject">Message subject *</label>
              <input
                name="messageSubject"
                onChange={handleChange}
                disabled={sendMessageMutation.isPending}
                placeholder="Enter your message subject"
                className="focus:border-primary border-grey-300 rounded-lg border bg-transparent p-3 transition duration-200 focus:outline-none"
                type="text"
                id="message_subject"
              />
              <span className="text-grey-300 text-xs font-light italic">
                {pluralize(78 - formData.messageSubject.length, 'character')}{' '}
                remaining
              </span>
            </div>
            <Select
              defaultValue="text/plain"
              onValueChange={(value) =>
                handleChange({ target: { name: 'contentType', value } })
              }
              disabled={sendMessageMutation.isPending}
            >
              <SelectGroup>
                <SelectLabel>Content Type*</SelectLabel>
                <SelectTrigger id="content_type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text/plain">text/plain</SelectItem>
                  <SelectItem value="text/html">text/html</SelectItem>
                </SelectContent>
              </SelectGroup>
            </Select>
          </div>
        )}
        <div className="grid gap-2">
          <label htmlFor="messageContent">
            Enter {isMail ? 'email' : 'telegram'} content *
          </label>
          <Textarea
            maxLength={512000}
            name="messageContent"
            onChange={handleChange}
            disabled={sendMessageMutation.isPending}
            placeholder="Enter your message content"
            id="messageContent"
          />
          <span className="text-grey-300 text-xs font-light italic">
            {pluralize(512000 - formData.messageContent.length, 'character')}{' '}
            remaining
          </span>
        </div>
        {sendMessageMutation.isError && (
          <Alert variant="error">
            <p>Oops, something went wrong while adding an authorized user.</p>
            <p>
              {sendMessageMutation.error.cause
                ? (sendMessageMutation.error.cause as Error).message.toString()
                : sendMessageMutation.error.toString()}
            </p>
            {sendMessageMutation.error.message ===
              'Failed to sign data access' &&
              !(sendMessageMutation.error.cause as Error).message.startsWith(
                'ethers-user-denied'
              ) && (
                <p>
                  Are you sure your protected data was created in the same
                  environment?
                </p>
              )}
          </Alert>
        )}
        <div className="mt-2 flex justify-end gap-5">
          <Button asChild variant="outline">
            <Link to="/contacts">Cancel</Link>
          </Button>
          <Button type="submit" isLoading={sendMessageMutation.isPending}>
            Send message
          </Button>
        </div>
      </form>
      <DocLink>
        dataprotector-sdk / Method called:{' '}
        <a
          href="https://tools.docs.iex.ec/tools/dataProtector/dataProtectorCore/getProtectedData"
          target="_blank"
          rel="noreferrer"
          className="text-primary whitespace-pre hover:underline"
        >
          <br />
          getProtectedData({'{'}
          <br />
          {'  '}protectedDataAddress: "{protectedDataAddress}",
          <br />
          {'}'});
        </a>
      </DocLink>
      {isMail ? (
        <DocLink>
          web3mail / Method called:{' '}
          <a
            href="https://tools.docs.iex.ec/tools/web3mail/methods/sendEmail"
            target="_blank"
            rel="noreferrer"
            className="text-primary whitespace-pre hover:underline"
          >
            <br />
            sendEmail({'{'}
            <br />
            {'  '}protectedData: "{protectedDataAddress}",
            <br />
            {'  '}emailSubject: "
            {formData.messageSubject ? formData.messageSubject : 'undefined'}",
            <br />
            {'  '}senderName: "
            {formData.senderName ? formData.senderName : 'undefined'}",
            <br />
            {'  '}contentType: "{formData.contentType}",
            <br />
            {'  '}emailContent: "
            <span className="table-cell max-w-52 truncate">
              {formData.messageContent}
            </span>
            ",
            <br />
            {'}'});
          </a>
        </DocLink>
      ) : (
        <DocLink>
          web3telegram / Method called:{' '}
          <a
            href="https://tools.docs.iex.ec/tools/web3telegram/methods/sendTelegram"
            target="_blank"
            rel="noreferrer"
            className="text-primary whitespace-pre hover:underline"
          >
            <br />
            sendTelegram({'{'}
            <br />
            {'  '}protectedData: "{protectedDataAddress}",
            <br />
            {'  '}senderName: "{formData.senderName}",
            <br />
            {'  '}telegramContent: "
            <span className="table-cell max-w-52 truncate">
              {formData.messageContent}
            </span>
            " ,
            <br />
            {'}'});
          </a>
        </DocLink>
      )}
    </div>
  );
}
