export const sanitizeId = (id: string | string[]) => {
  if (typeof id === "string") return BigInt(id);
  return BigInt(id[0]);
};

export const checkForSameValue = async (
  category: any,
  columnName: any,
  value: any,
) => {
  return category[columnName] === value;
};
