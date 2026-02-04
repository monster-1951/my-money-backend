import {z} from 'zod'

export const UserSchema = z.object({
    name:z.string(),
    email:z.email(),
    password:z.string()
})

export interface User extends z.infer<typeof UserSchema> {}