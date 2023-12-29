"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { PersonIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const SidePanel = () => {
    // const [broken, setBroken] = React.useState(
    //     window.matchMedia("(max-width: 900px)").matches
    // );
    const currentPath = usePathname();
    const { data: session } = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const sideBarRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Toggling isOpen state directly
    };

    const links = [
        { label: "Dashboard", href: "/admin" },
        { label: "About", href: "/admin/about" },
        { label: "Porfolio", href: "/admin/portfolio" },
    ];

    return (
        <div>
            <div className={`md:hidden`}>
                <Sheet>
                    <SheetTrigger className="mt-24  pl-1 fixed">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </SheetTrigger>
                    <SheetContent side={"left"} className="h-screen">
                        <SheetHeader>
                            <SheetDescription className="pt-28">
                                <div className="text-center text-xs space-y-4">
                                    <span>
                                        <Avatar className="text-center mx-auto">
                                            <AvatarImage src="" />
                                            <AvatarFallback>
                                                <PersonIcon />
                                            </AvatarFallback>
                                        </Avatar>
                                    </span>
                                    <p>{session?.user?.email}</p>
                                    <Separator />
                                    <ul className="space-y-2 pt-4 text-lg list-inside">
                                        {links.map((link) => (
                                            <li
                                                key={link.href}
                                                className="flex items-center hover:bg-primary hover:text-primary-foreground rounded "
                                            >
                                                <Link
                                                    className={classnames({
                                                        "w-full p-5": link.label,
                                                        "border rounded": link.href == currentPath,
                                                        "nav-link": true,
                                                    })}
                                                    href={link.href}
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden fixed h-screen md:flex flex-col w-[270px] pt-2 shadow-lg">
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 bg-background border rounded">
                        <div className="text-center text-xs space-y-4 pt-20">
                            <span>
                                <Avatar className="text-center mx-auto">
                                    <AvatarImage src="" />
                                    <AvatarFallback>
                                        <PersonIcon />
                                    </AvatarFallback>
                                </Avatar>
                            </span>
                            <p className="text-primary">{session?.user?.email}</p>
                            <Separator />
                            <ul className="space-y-2 pt-4 text-lg text-primary list-inside">
                                {links.map((link) => (
                                    <li
                                        key={link.href}
                                        className="flex items-center rounded hover:bg-primary hover:text-primary-foreground"
                                    >
                                        <Link
                                            className={classnames({
                                                "w-full p-5": link.label,
                                                "nav-link": true,
                                            })}
                                            href={link.href}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
