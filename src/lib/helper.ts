import * as lodash from "lodash";

export const sanitizeId = (id: any) => {
  if (lodash.isArray(id)) 
    return BigInt(id[0]);
  return BigInt(id);
};

export const checkForSameValue = async (
  category: any,
  columnName: any,
  value: any,
) => {
  return category[columnName] === value;
};

(BigInt.prototype as any).toJSON = function () {
return (Number(this));
}