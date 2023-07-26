import { Contract, WalletConnection } from "near-api-js";
import * as nearAPI from "near-api-js";
import { BN } from "bn.js";
import { Wallet } from "@near-wallet-selector/core";
import { FinalExecutionOutcome } from "near-api-js/lib/providers";

import near from "providers/near";
import { AccountId } from "../market/market.types";

import {
  FungibleTokenContractMethods,
  FungibleTokenContractValues,
  FtTransferCallArgs,
  FtBalanceOfArgs,
} from "./fungible-token.types";
import { CHANGE_METHODS, VIEW_METHODS } from "./constants";

export class FungibleTokenContract {
  values: FungibleTokenContractValues | undefined;

  contractAddress: AccountId;

  contract: Contract & FungibleTokenContractMethods;

  constructor(contractAddress: AccountId, contract: Contract & FungibleTokenContractMethods) {
    this.contract = contract;
    this.contractAddress = contractAddress;
  }

  static async loadFromGuestConnection(contractAddress: string) {
    const connection = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
      headers: {},
      ...near.getConfig(),
    });

    const account = await connection.account(near.getConfig().guestWalletId);
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    const contract = near.initContract<FungibleTokenContractMethods>(account, contractAddress, contractMethods);

    return new FungibleTokenContract(contractAddress, contract);
  }

  static async loadFromWalletConnection(connection: WalletConnection, contractAddress: string) {
    const account = await connection.account();
    const contractMethods = { viewMethods: VIEW_METHODS, changeMethods: CHANGE_METHODS };

    const contract = near.initContract<FungibleTokenContractMethods>(account, contractAddress, contractMethods);

    return new FungibleTokenContract(contractAddress, contract);
  }

  static async ftTransferCall(wallet: Wallet, contractAddress: AccountId, args: FtTransferCallArgs) {
    try {
      const gas = new BN("60000000000000");

      const response = await wallet.signAndSendTransaction({
        receiverId: contractAddress,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "ft_transfer_call",
              args,
              gas: gas.toString(),
              deposit: "1",
            },
          },
        ],
      });

      near.unwrapFinalExecutionOutcome(response as FinalExecutionOutcome);
    } catch (error) {
      console.log(error);

      throw new Error("ERR_FungibleTokenContract_ftTransferCall");
    }

    return "0.00";
  }

  async ftBalanceOf(args: FtBalanceOfArgs) {
    try {
      const result = await this.contract.ft_balance_of(args);

      return result;
    } catch (error) {
      console.log(error);
    }

    return "0.00";
  }

  async ftMetadata() {
    try {
      const result = await this.contract.ft_metadata();

      return result;
    } catch (error) {
      console.log(error);
    }

    return undefined;
  }
}
