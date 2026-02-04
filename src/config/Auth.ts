import { genSaltSync } from "bcrypt-ts";

export const salt = genSaltSync(10);