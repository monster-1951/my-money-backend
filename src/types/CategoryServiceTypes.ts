import { ServiceResponse } from "./StandardTypes";

type category_type = "Income" | "Expense";

export interface Category {
  id: bigint;
  name: string;
  category_type: category_type;
  user_id: bigint;
}

export interface NewCategory extends Category {}

// PARAMS TYPES

export interface getAllCategoriesParams {
  user_id: bigint;
}

export interface findExistingCategoryByNameParams {
  name: string;
  user_id: bigint;
}

export interface findExistingCategoryByIdParams {
  id: string | string[];
  user_id: bigint;
}

export interface CreateCategoryParams {
  name: string;
  category_type: category_type;
  user_id: bigint;
}

export interface CategoryDataToModify {
  name: string;
  category_type: category_type;
}

export interface UpdateParams {
  data: CategoryDataToModify,
  id: bigint
}
export interface UpdateCategoryParams {
  id: string | string[];
  dataToModify: CategoryDataToModify;
  user_id: bigint;
}

export interface DeleteCategoryParams extends findExistingCategoryByIdParams {}

// RESPONSE TYPES

export interface getAllCategoriesResponse extends ServiceResponse {
  categories?: Category[];
}

export interface CreateCategoryResponse extends ServiceResponse {
  newCategory?: NewCategory;
}

export interface findExistingCategoryResponse extends ServiceResponse {
  existingCategory?: Category[];
}

export interface UpdateCategoryResponse extends ServiceResponse {
  updatedCategory?: Category;
}

export interface DeleteCategoryResponse extends ServiceResponse {
  deletedCategory?: Category;
}
