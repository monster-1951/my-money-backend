import { prisma } from "../lib/prisma";
import * as AccountServiceTypes from "../types/AccountServiceTypes";
import * as Utility from '../lib/helper'

const ACCOUNTS = prisma.accounts;

// HELPERS



export const findExistingAccountByIdOrName = async (
  params: AccountServiceTypes.findExistingAccountParams,
): Promise<AccountServiceTypes.findExistingAccountByIdOrNameResponse> => {
  let existingAccountsOfUser: AccountServiceTypes.Account[];
  try {
    if (params.id) {
      const id = Utility.sanitizeId(params.id);
      existingAccountsOfUser = await ACCOUNTS.findMany({
        where: {
          AND: {
            user_id: params.user_id,
            id: id,
          },
        },
      });
    } else {
      existingAccountsOfUser = await ACCOUNTS.findMany({
        where: {
          AND: {
            user_id: params.user_id,
            name: params.name,
          },
        },
      });
    }
    if (!existingAccountsOfUser.length) {
      return { message: "No accounts found", statusCode: 404 };
    }

    return {
      existingAccountsOfUser,
      message: "Accounts found",
      statusCode: 200,
    };
  } catch (error) {
    return { message: "Error in fetching accounts", statusCode: 404, error };
  }
};

export const checkIfUpdateIsValid = async (params: {
  id: string | string[];
  user_id: bigint;
  newData: AccountServiceTypes.AccountDataToModify;
}) => {
  let isUpdateValid = false;
  let key: keyof AccountServiceTypes.AccountDataToModify;
  const { existingAccountsOfUser } = await findExistingAccountByIdOrName({
    id: params.id,
    user_id: params.user_id,
  });
  if (existingAccountsOfUser) {
    for (key in params.newData) {
      if (
        await Utility.checkForSameValue(
          existingAccountsOfUser[0],
          key,
          params.newData[key],
        )
      ) {
        continue;
      } else {
        isUpdateValid = true;
        break;
      }
    }
  }
  return isUpdateValid;
};

export const update = async (
  data: AccountServiceTypes.AccountDataToModify,
  id: bigint,
): Promise<AccountServiceTypes.updateAccountResponse> => {
  try {
    const updatedAccount = await ACCOUNTS.update({
      where: {
        id: id,
      },
      data,
    });
    return {
      message: "Account Updated Successfully",
      statusCode: 200,
      updatedAccount,
    };
  } catch (error) {
    return {
      message: "Updating account failed",
      statusCode: 500,
      error,
    };
  }
};

// MAIN FUNCTIONS

export const createNewAccount = async (
  params: AccountServiceTypes.createNewAccountParams,
): Promise<AccountServiceTypes.createNewAccountResponse> => {
  try {
    const { existingAccountsOfUser } = await findExistingAccountByIdOrName({
      name: params.name,
      user_id: params.user_id,
    });
    if (existingAccountsOfUser) {
      return {
        message: "Account already exists with this name",
        statusCode: 409,
      };
    }
    const newAccount = await ACCOUNTS.create({
      data: params,
    });
    return {
      message: "New account creation successfull",
      newAccount,
      statusCode: 200,
    };
  } catch (error) {
    return { message: "New acccount creation failed", statusCode: 500, error };
  }
};

export const getAllAccounts = async (params: {
  user_id: bigint;
}): Promise<AccountServiceTypes.getAllAccountsResponse> => {
  try {
    const allAccounts = await ACCOUNTS.findMany({
      where: {
        user_id: params.user_id,
      },
    });
    return {
      allAccounts,
      message: "Accounts Fetched successfully",
      statusCode: 200,
    };
  } catch (error) {
    return { error, message: "Fetching Accounts Failed", statusCode: 500 };
  }
};

export const updateAccount = async (
  params: AccountServiceTypes.updateAccountParams,
): Promise<AccountServiceTypes.updateAccountResponse> => {
  const id = Utility.sanitizeId(params.id);
  const newData = params.dataToModify;
  try {
    const isUpdateValid = await checkIfUpdateIsValid({
      id: params.id,
      user_id: params.user_id,
      newData,
    });
    if (isUpdateValid) {
      const response = await update(newData, id);
      return response;
    } else {
      return {
        message: "The existing account already matches the data you sent",
        statusCode: 422,
      };
    }
  } catch (error) {
    return { message: "Failed to update account", statusCode: 500, error };
  }
};

export const deleteAccount = async (
  params: AccountServiceTypes.deleteAccountParams,
): Promise<AccountServiceTypes.deleteAccountResponse> => {
  const id = Utility.sanitizeId(params.id);
  try {
    const deletedAccount = await ACCOUNTS.delete({
      where: {
        id,
        user_id: params.user_id,
      },
    });
    return { message: "", statusCode: 200, deletedAccount };
  } catch (error) {
    return { message: "", statusCode: 500, error };
  }
};
