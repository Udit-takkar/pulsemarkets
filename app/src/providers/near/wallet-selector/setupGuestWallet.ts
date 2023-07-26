import * as nearAPI from "near-api-js";
import type {
  WalletModuleFactory,
  WalletBehaviourFactory,
  BrowserWallet,
  Transaction,
  Optional,
  Network,
  Account,
} from "@near-wallet-selector/core";
import { createAction } from "@near-wallet-selector/wallet-utils";

const icon = `data:image/png;base64,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`;

export type GuestWalletParams = {
  walletUrl?: string;
  iconUrl?: string;
  deprecated?: boolean;
  successUrl?: string;
  failureUrl?: string;
};

type GuestWalletState = {
  wallet: nearAPI.WalletConnection;
  keyStore: nearAPI.keyStores.BrowserLocalStorageKeyStore;
};

type GuestWalletExtraOptions = {
  walletUrl: string;
};

const resolveWalletUrl = (network: Network, walletUrl?: string) => {
  if (walletUrl) {
    return walletUrl;
  }

  switch (network.networkId) {
    case "mainnet":
      return "https://app.mynearwallet.com";
    case "testnet":
      return "https://testnet.mynearwallet.com";
    default:
      throw new Error("Invalid wallet url");
  }
};

const setupWalletState = async (params: GuestWalletExtraOptions, network: Network): Promise<GuestWalletState> => {
  const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();

  const near = await nearAPI.connect({
    keyStore,
    walletUrl: params.walletUrl,
    ...network,
    headers: {},
  });

  const wallet = new nearAPI.WalletConnection(near, "promptwars");

  return {
    wallet,
    keyStore,
  };
};

const GuestWallet: WalletBehaviourFactory<BrowserWallet, { params: GuestWalletExtraOptions }> = async ({
  metadata,
  options,
  store,
  params,
  logger,
}) => {
  const $state = await setupWalletState(params, options.network);

  const getAccounts = async (): Promise<Array<Account>> => {
    const accountId = $state.wallet.getAccountId();
    const account = $state.wallet.account();

    if (!accountId || !account) {
      return [];
    }

    const publicKey = await account.connection.signer.getPublicKey(account.accountId, options.network.networkId);

    return [
      {
        accountId,
        publicKey: publicKey ? publicKey.toString() : "",
      },
    ];
  };

  const transformTransactions = async (transactions: Array<Optional<Transaction, "signerId">>) => {
    const account = $state.wallet.account();
    const { networkId, signer, provider } = account.connection;

    const localKey = await signer.getPublicKey(account.accountId, networkId);

    return Promise.all(
      transactions.map(async (transaction, index) => {
        const actions = transaction.actions.map((action) => createAction(action));
        const accessKey = await account.accessKeyForTransaction(transaction.receiverId, actions, localKey);

        if (!accessKey) {
          throw new Error(`Failed to find matching key for transaction sent to ${transaction.receiverId}`);
        }

        const block = await provider.block({ finality: "final" });

        return nearAPI.transactions.createTransaction(
          account.accountId,
          nearAPI.utils.PublicKey.from(accessKey.public_key),
          transaction.receiverId,
          accessKey.access_key.nonce + index + 1,
          actions,
          nearAPI.utils.serialize.base_decode(block.header.hash),
        );
      }),
    );
  };

  return {
    async signIn({ contractId, methodNames, successUrl, failureUrl }) {
      const existingAccounts = await getAccounts();

      if (existingAccounts.length) {
        return existingAccounts;
      }

      await $state.wallet.requestSignIn({
        contractId,
        methodNames,
        successUrl,
        failureUrl,
      });

      return getAccounts();
    },

    async signOut() {
      if ($state.wallet.isSignedIn()) {
        $state.wallet.signOut();
      }
    },

    async getAccounts() {
      return getAccounts();
    },

    async verifyOwner() {
      throw new Error(`Method not supported by ${metadata.name}`);
    },

    async signAndSendTransaction({ signerId, receiverId, actions, callbackUrl }) {
      logger.log("signAndSendTransaction", {
        signerId,
        receiverId,
        actions,
        callbackUrl,
      });

      const { contract } = store.getState();

      if (!$state.wallet.isSignedIn() || !contract) {
        throw new Error("Wallet not signed in");
      }

      const account = $state.wallet.account();

      return account.signAndSendTransaction({
        receiverId: receiverId || contract.contractId,
        actions: actions.map((action) => createAction(action)),
        walletCallbackUrl: callbackUrl,
      });
    },

    async signAndSendTransactions({ transactions, callbackUrl }) {
      logger.log("signAndSendTransactions", { transactions, callbackUrl });

      if (!$state.wallet.isSignedIn()) {
        throw new Error("Wallet not signed in");
      }

      return $state.wallet.requestSignTransactions({
        transactions: await transformTransactions(transactions),
        callbackUrl,
      });
    },

    buildImportAccountsUrl() {
      return `${params.walletUrl}/batch-import`;
    },
  };
};

export function setupGuestWallet({
  walletUrl,
  iconUrl = icon,
  deprecated = false,
  successUrl = "",
  failureUrl = "",
}: GuestWalletParams = {}): WalletModuleFactory<BrowserWallet> {
  return async (moduleOptions) => ({
    id: "guest-wallet",
    type: "browser",
    metadata: {
      name: "Guest Wallet",
      description: "NEAR wallet to store, buy, send and stake assets for DeFi.",
      iconUrl,
      deprecated,
      available: true,
      successUrl,
      failureUrl,
      walletUrl: resolveWalletUrl(moduleOptions.options.network, walletUrl),
    },
    init: (options) =>
      GuestWallet({
        ...options,
        params: {
          walletUrl: resolveWalletUrl(options.options.network, walletUrl),
        },
      }),
  });
}
