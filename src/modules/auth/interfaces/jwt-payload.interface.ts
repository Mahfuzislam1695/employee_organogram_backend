import { Role } from '@prisma/client';

export interface JwtPayload {
    sub: number;
    username: string;
    roles: Role[];
}