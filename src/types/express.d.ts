import { JwtPayload } from "jsonwebtoken";

interface DecodedUserPayload extends JwtPayload {
  id: bigint;
  email: string;
  name: string;
  // add other fields from your JWT payload
}

declare global {
    namespace Express {
        interface Request {
            user: DecodedUserPayload
        }
    }
}
