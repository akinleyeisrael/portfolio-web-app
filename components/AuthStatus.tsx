"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import Logout from "@/app/logout/logout";

const AuthStatus = () => {
    const { data: session } = useSession();

    return (
        <div>
            {session && (
                <DropdownMenu>
                    <DropdownMenuTrigger className="text-sm pt-3">
                        <p >LoggedIn
                            <span className="absolute m-1 text-green-600">
                                <CheckCircledIcon />
                            </span>
                        </p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Logout />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* {session && <Logout />}
            {!session && <Link href="/login">Login</Link>} */}
        </div>
    );
};

export default AuthStatus;
