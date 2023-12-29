import { DefaultUser } from 'next-auth';
declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & { id: string; role: string; userName: string };
    }
    interface User extends DefaultUser {
        role: string;
        userName: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        userName: string
    }
}

