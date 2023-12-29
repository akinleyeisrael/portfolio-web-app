"use client"
import Logout from '@/app/logout/logout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import classnames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const TopNav = () => {
    const currentPath = usePathname();
    const { data: session } = useSession();
    const router = useRouter();


    const links = [
        { label: "Dashboard", href: "/admin" },
        { label: "About", href: "/admin/about" },
        { label: "Porfolio", href: "/admin/portfolio" },
    ];
    return (
        <div className='items-center top-10 mt-6 inset-x-2 z-50 fixed justify-center mx-auto max-w-7xl px-10 md:ml-[17rem] bg-background border p-5 my-4 rounded '>
            <nav className="">
                <div className="pr-4 text-primary text-xs space-x-4 md:text-base md:flex-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={classnames({
                                "border border-primary p-2 rounded": link.href == currentPath,
                                "nav-link": true,
                            })}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className='float-right'>
                        <DropdownMenu>
                            <DropdownMenuTrigger className=' text-center text-xs'>profile</DropdownMenuTrigger>
                            <DropdownMenuContent className='text-justify'>
                                <DropdownMenuLabel>
                                    {session?.user?.userName}
                                    <span className="absolute p-1 text-green-600">
                                        <CheckCircledIcon />
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator  />
                                <DropdownMenuItem>
                                    <Link href={"/admin/profile"} className='w-full'>Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='' >
                                    <Logout/>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

            </nav>
        </div>
    )
}

export default TopNav