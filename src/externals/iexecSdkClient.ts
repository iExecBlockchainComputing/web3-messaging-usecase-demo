import {
  IExecDataProtector,
  IExecDataProtectorCore,
  IExecDataProtectorSharing,
} from '@iexec/dataprotector';
import { IExecWeb3mail } from '@iexec/web3mail';
import { IExecWeb3telegram } from '@iexec/web3telegram';
import { Eip1193Provider } from 'iexec';
import { type Connector } from 'wagmi';

let iExecDataProtectorCore: IExecDataProtectorCore | null = null;
let iExecDataProtectorSharing: IExecDataProtectorSharing | null = null;
let iExecWeb3mail: IExecWeb3mail | null = null;
let iExecWeb3telegram: IExecWeb3telegram | null = null;

// Basic promise queue for pending getDataProtectorCoreClient() requests
const DATA_PROTECTOR_CORE_CLIENT_RESOLVES: Array<
  Promise<IExecDataProtectorCore>
> = [];
// Basic promise queue for pending getDataProtectorCoreClient() requests
const DATA_PROTECTOR_SHARING_CLIENT_RESOLVES: Array<
  Promise<IExecDataProtectorSharing>
> = [];
// Basic promise queue for pending getWeb3mailClient() requests
const WEB3MAIL_CLIENT_RESOLVES: Array<Promise<IExecWeb3mail>> = [];
// Basic promise queue for pending getWeb3telegramClient() requests
const WEB3TELEGRAM_CLIENT_RESOLVES: Array<Promise<IExecWeb3telegram>> = [];

// Clean SDKs
export function cleanIExecSDKs() {
  iExecDataProtectorCore = null;
  iExecDataProtectorSharing = null;
  iExecWeb3mail = null;
  iExecWeb3telegram = null;
}

export async function initIExecSDKs({ connector }: { connector?: Connector }) {
  if (!connector || !connector.getProvider) {
    cleanIExecSDKs();
    return;
  }

  const provider = (await connector.getProvider()) as Eip1193Provider;
  if (!provider) {
    cleanIExecSDKs();
    return;
  }

  const dataProtectorParent = new IExecDataProtector(provider);

  iExecDataProtectorCore = dataProtectorParent.core;
  iExecDataProtectorSharing = dataProtectorParent.sharing;

  // Initialize

  DATA_PROTECTOR_CORE_CLIENT_RESOLVES.forEach((resolve) => {
    return resolve(iExecDataProtectorCore);
  });
  DATA_PROTECTOR_CORE_CLIENT_RESOLVES.length = 0;

  DATA_PROTECTOR_SHARING_CLIENT_RESOLVES.forEach((resolve) => {
    return resolve(iExecDataProtectorSharing);
  });
  DATA_PROTECTOR_SHARING_CLIENT_RESOLVES.length = 0;

  iExecWeb3mail = new IExecWeb3mail(provider);
  WEB3MAIL_CLIENT_RESOLVES.forEach((resolve) => {
    return resolve(iExecWeb3mail);
  });
  WEB3MAIL_CLIENT_RESOLVES.length = 0;

  iExecWeb3telegram = new IExecWeb3telegram(provider, {
    ipfsNode: 'https://ipfs-upload.v8-bellecour.iex.ec',
  });
  WEB3TELEGRAM_CLIENT_RESOLVES.forEach((resolve) => {
    return resolve(iExecWeb3telegram);
  });
  WEB3TELEGRAM_CLIENT_RESOLVES.length = 0;
}

export async function getDataProtectorCoreClient(): Promise<IExecDataProtectorCore> {
  if (!iExecDataProtectorCore) {
    return new Promise((resolve) =>
      DATA_PROTECTOR_CORE_CLIENT_RESOLVES.push(resolve)
    );
  }
  return iExecDataProtectorCore;
}

export async function getWeb3telegramClient(): Promise<IExecWeb3telegram> {
  if (!iExecWeb3telegram) {
    return new Promise((resolve) => WEB3TELEGRAM_CLIENT_RESOLVES.push(resolve));
  }
  return iExecWeb3telegram;
}

export async function getWeb3mailClient(): Promise<IExecWeb3mail> {
  if (!iExecWeb3mail) {
    return new Promise((resolve) => WEB3MAIL_CLIENT_RESOLVES.push(resolve));
  }
  return iExecWeb3mail;
}
