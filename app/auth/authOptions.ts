import prisma from "@/lib/client";
import { userSchema } from "@/lib/validationSchema";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req): Promise<any> {
                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials?.email,
                        },
                    });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    const passwordValid = await compare(
                        credentials?.password!,
                        user.password
                    );
                    if (!passwordValid) {
                        throw new Error("Invalid password");
                    }
                    //retunr based on username in database, then retunrn and additional property role for authorization
                    if (user.userName.includes("admin")) {
                        return {
                            ...user,
                            role: "admin"
                        };
                    }
                    else {
                        return {
                            ...user,
                            role: "user"
                        }
                    }
                } catch (error) {
                    console.log("error authenticating");
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.userName = user.userName
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role
                //add username to user in session from extended user session in auth.d.ts
                session.user.userName = token.userName
            }
            return session;
        },

    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        signOut: "/"
    },
}; 
