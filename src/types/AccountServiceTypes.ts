import { ServiceResponse } from "./StandardTypes";

export interface Account {
  id: bigint;
  name: string;
  balance: number;
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

// export interface updateAccountParams extends createNewAccountParams {
//     id: string | string[];
// }

export interface updateAccountParams {
  id: string | string[];
  user_id: bigint;
  dataToModify: AccountDataToModify;
}

export interface deleteAccountParams extends getAccountByIdParams {}

// RESPONSE TYYPES

export interface createNewAccountResponse extends ServiceResponse {
  newAccount?: newAccount;
}

export interface getAllAccountsResponse extends ServiceResponse {
  allAccounts?: newAccount[];
  TotalCount?: number;
}

export interface getAccountByIdResponse extends ServiceResponse {
  Account?: Account;
}

export interface findExistingAccountByIdOrNameResponse extends ServiceResponse {
  existingAccountsOfUser?: Account[];
}

export interface updateAccountResponse extends ServiceResponse {
  updatedAccount?: Account;
}

export interface deleteAccountResponse extends ServiceResponse {
  deletedAccount?: Account;
}
