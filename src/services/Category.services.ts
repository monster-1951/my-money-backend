import { prisma } from "../lib/prisma";
import * as CategoryServiceTypes from "../types/CategoryServiceTypes";
import * as Utility from "../lib/helper";

const CATEGORIES = prisma.categories;

const findExistingCategoryByName = async (
  params: CategoryServiceTypes.findExistingCategoryByNameParams,
): Promise<CategoryServiceTypes.findExistingCategoryResponse> => {
  try {
    const existingCategory = await CATEGORIES.findMany({
      where: {
        AND: {
          user_id: params.user_id,
          name: params.name,
        },
      },
    });
    return { message: "Found Category", statusCode: 200, existingCategory };
  } catch (error) {
    return { message: "Failed to find Category", statusCode: 500, error };
  }
};

export const findExistingCategoryById = async (
  params: CategoryServiceTypes.findExistingCategoryByIdParams,
): Promise<CategoryServiceTypes.findExistingCategoryResponse> => {
  const id = Utility.sanitizeId(params.id);
  try {
    const existingCategory = await CATEGORIES.findMany({
      where: {
        AND: {
          user_id: params.user_id,
          id,
        },
      },
    });
    return { message: "Found Category", statusCode: 200, existingCategory };
  } catch (error) {
    return { message: "Failed to find Category", statusCode: 500, error };
  }
};

export const getAll = async (
  params: CategoryServiceTypes.getAllCategoriesParams,
): Promise<CategoryServiceTypes.getAllCategoriesResponse> => {
  try {
    const categories = await CATEGORIES.findMany({
      where: {
        user_id: params.user_id,
      },
    });
    return {
      message: "Finding Categories successful",
      statusCode: 200,
      categories,
      TotalCount:categories.length
    };
  } catch (error) {
    return { message: "Failed to find Categories", statusCode: 500, error };
  }
};

export const Create = async (
  params: CategoryServiceTypes.CreateCategoryParams,
): Promise<CategoryServiceTypes.CreateCategoryResponse> => {
  const findExistingCategory = {
    name: params.name,
    user_id: params.user_id,
  };
  try {
    const { existingCategory } =
      await findExistingCategoryByName(findExistingCategory);
    if (existingCategory?.length) {
      return {
        message: "Category already exists",
        statusCode: 409,
      };
    }
    const newCategory = await CATEGORIES.create({
      data: params,
    });
    return {
      message: "Created Category Successfully",
      statusCode: 200,
      newCategory,
    };
  } catch (error) {
    return { message: "Failed to Create Category", statusCode: 500, error };
  }
};

export const DeleteCategory = async (
  params: CategoryServiceTypes.DeleteCategoryParams,
): Promise<CategoryServiceTypes.DeleteCategoryResponse> => {
  const id = Utility.sanitizeId(params.id);
  try {
    const deletedCategory = await CATEGORIES.delete({
      where: {
        id,
        user_id: params.user_id,
      },
    });
    return { message: "Deleted Category", statusCode: 200, deletedCategory };
  } catch (error) {
    return { message: "Failed to delete Category", statusCode: 500, error };
  }
};

export const Update = async (
  params: CategoryServiceTypes.UpdateParams,
): Promise<CategoryServiceTypes.UpdateCategoryResponse> => {
  try {
    const updatedCategory = await CATEGORIES.update({
      where: {
        id: params.id,
      },
      data: params.data,
    });
    return {
      message: "Updated Category Successfully",
      statusCode: 200,
      updatedCategory,
    };
  } catch (error) {
    return {
      message: "Updating Category failed",
      statusCode: 500,
      error,
    };
  }
};

export const checkIfUpdateIsValid = async (params: {
  id: string | string[];
  user_id: bigint;
  newData: CategoryServiceTypes.CategoryDataToModify;
}) => {
  let isUpdateValid = false;
  let key: keyof CategoryServiceTypes.CategoryDataToModify;
  const { existingCategory } = await findExistingCategoryById({
    id: params.id,
    user_id: params.user_id,
  });
  if (existingCategory) {
    for (key in params.newData) {
      if (
        await Utility.checkForSameValue(
          existingCategory[0],
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

export const UpdateCategory = async (
  params: CategoryServiceTypes.UpdateCategoryParams,
): Promise<CategoryServiceTypes.UpdateCategoryResponse> => {
  const id = Utility.sanitizeId(params.id);
  const updateParams = {
    data: params.dataToModify,
    id,
  };
  const checkIfUpdateIsValidParams = {
    id: params.id,
    user_id: params.user_id,
    newData: params.dataToModify,
  };
  try {
    const isUpdateValid = await checkIfUpdateIsValid(
      checkIfUpdateIsValidParams,
    );
    if (isUpdateValid) {
      const response = await Update(updateParams);
      return response;
    } else {
      return {
        message: "The existing account already matches the data you sent",
        statusCode: 422,
      };
    }
  } catch (error) {
    return { message: "Failed to update category", statusCode: 500, error };
  }
};
