import { DocLink } from '@/components/DocLink';

export const steps = [
  {
    title: 'Create a protected data',
    content: (
      <>
        <p>
          Type: <strong>Telegram</strong>
        </p>
        <DocLink className="w-full" forceActive={true}>
          dataprotector-sdk / Method called:{' '}
          <a
            href="https://docs.iex.ec/references/dataProtector/dataProtectorCore/protectData"
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
            telegram_chatId: "123456789",
            <br />
            {'  }'}
            <br />
            {'  '}name: "Antoine Telegram",
            <br />
            {'}'});
          </a>
        </DocLink>
        <p>
          Or type: <strong>Mail</strong>
        </p>
        <DocLink className="w-full" forceActive={true}>
          dataprotector-sdk / Method called:{' '}
          <a
            href="https://docs.iex.ec/references/dataProtector/dataProtectorCore/protectData"
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
            email: "example@gmail.com",
            <br />
            {'  }'}
            <br />
            {'  '}name: "Antoine Mail",
            <br />
            {'}'});
          </a>
        </DocLink>
      </>
    ),
  },
  {
    title: 'Grant Access to your data',
    content: (
      <>
        <DocLink forceActive={true}>
          dataprotector-sdk / Method called:{' '}
          <a
            href="https://docs.iex.ec/references/dataProtector/dataProtectorCore/grantAccess"
            target="_blank"
            rel="noreferrer"
            className="text-primary whitespace-pre hover:underline"
          >
            <br />
            grantAccess({'{'}
            <br />
            {'  '}protectedData: "0x123abc...",
            <br />
            {'  '}authorizedUser: "userAddress",
            <br />
            {'  '}authorizedApp: "0x789cba... " ,
            <br />
            {'  '}numberOfAccess: "10"
            <br />
            {'}'});
          </a>
        </DocLink>
      </>
    ),
  },
  {
    title: 'Send a message',
    content: (
      <>
        <p>Send a message with granted access wallet</p>
        <p>
          Type: <strong>Telegram</strong>
        </p>
        <DocLink forceActive={true}>
          web3telegram / Method called:{' '}
          <a
            href="https://docs.iex.ec/references/web3telegram/methods/sendTelegram"
            target="_blank"
            rel="noreferrer"
            className="text-primary whitespace-pre hover:underline"
          >
            <br />
            sendTelegram({'{'}
            <br />
            {'  '}protectedData: "0x123abc...",
            <br />
            {'  '}senderName: "Antoine Wallet",
            <br />
            {'  '}telegramContent: "My message",
            <br />
            {'}'});
          </a>
        </DocLink>
        <p>
          Or type: <strong>Mail</strong>
        </p>
        <DocLink forceActive={true}>
          web3mail / Method called:{' '}
          <a
            href="https://docs.iex.ec/references/web3mail/methods/sendEmail"
            target="_blank"
            rel="noreferrer"
            className="text-primary whitespace-pre hover:underline"
          >
            <br />
            sendEmail({'{'}
            <br />
            {'  '}protectedData: "0x123abc...",
            <br />
            {'  '}emailSubject: "My subject",
            <br />
            {'  '}senderName: "Antoine Wallet",
            <br />
            {'  '}contentType: "text/plain",
            <br />
            {'  '}emailContent: "My message",
            <br />
            {'}'});
          </a>
        </DocLink>
      </>
    ),
  },
];
