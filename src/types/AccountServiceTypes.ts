import * as StandardTypes from "./StandardTypes";

export interface Account {
  id: bigint;
  name: string;
  balance: StandardTypes.money;
  user_id: bigint;
}

export interface newAccount extends Account {}

export interface AccountDataToModify {
  name?: string;
  balance?: number;
}

// PARAMS TYPES

export interface findExistingAccountParams {
  id?: string | string[];
  name?: string;
  user_id: bigint;
}

export interface getAccountByIdParams {
  id: string | string[];
  user_id: bigint;
}

export interface createNewAccountParams {
  name: string;
  balance: number;
  user_id: bigint;
}

export interface updateAccountParams {
  id: string | string[];
  user_id: bigint;
  dataToModify: AccountDataToModify;
}

export interface deleteAccountParams extends getAccountByIdParams {}

// RESPONSE TYPES

export interface createNewAccountResponse extends StandardTypes.ServiceResponse {
  newAccount?: newAccount;
}

export interface getAllAccountsResponse extends StandardTypes.ServiceResponse {
  allAccounts?: newAccount[];
  TotalCount?: number;
}

export interface getAccountByIdResponse extends StandardTypes.ServiceResponse {
  Account?: Account;
}

export interface findExistingAccountByIdOrNameResponse extends StandardTypes.ServiceResponse {
  existingAccountsOfUser?: Account[];
}

export interface updateAccountResponse extends StandardTypes.ServiceResponse {
  updatedAccount?: Account;
}

export interface deleteAccountResponse extends StandardTypes.ServiceResponse {
  deletedAccount?: Account;
}
