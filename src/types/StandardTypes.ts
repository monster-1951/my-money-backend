import { Decimal } from "@prisma/client/runtime/client";

export interface ServiceResponse {
    message: string;
    error?: unknown;
    statusCode: number;
}

export type money = Decimal