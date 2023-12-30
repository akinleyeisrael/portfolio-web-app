"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import classnames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthStatus from "./AuthStatus";
import { MotionDiv } from "@/components/framer";
import { useEffect } from "react";
import { useAnimation } from "framer-motion";
import Image from "next/image";

const NavBar = () => {
  // use client because it a browser api
  const currentPath = usePathname();

  const links = [
    { label: "Home", href: "/" },
    { label: "Software projects", href: "/portfolio/software-projects" },
    { label: "Music videos", href: "/portfolio/music-videos" },
    // { label: "Register", href: "/register" },
  ];

  const componentsPortfolio = [
    {
      title: "Software Projects",
      href: "/portfolio/software-projects",
    },
    {
      title: "Music Videos",
      href: "/portfolio/music-videos",
    },
  ]

  const controls = useAnimation();

  const handleClick = async () => {
    const section = document.getElementById("experience");
    section!.scrollIntoView({ behavior: "smooth" });
  };
  const handleClickProject = async () => {
    const section = document.getElementById("seeprojects");
    section!.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      controls.stop();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);


  return (
    <nav
      className="top-0 inset-x-0 z-50 sticky max-w-[100rem] w-full mx-auto backdrop-filter backdrop-blur-lg border-b sm:flex sm:items-center sm:justify-between "
      aria-label="Global"
    >
      <div className="flex items-center justify-between m-2">
        <Link href={"/"}>
          {/* <Image src={"/logo.png"} alt={"logo"} width={500} height={500}/> */}
          <span className="font-bold text-2xl mx-2 leading-tight tracking-wider">AKIN</span>
        </Link>
        <NavigationMenu className="hidden pl-6 md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[142px] ">
                  <MotionDiv animate={controls} onClick={handleClick}>
                    <Link className="w-full" scroll={false}
                      href={"/#experience"}
                    >
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Experience
                      </NavigationMenuLink>
                    </Link>
                  </MotionDiv>
                  <MotionDiv animate={controls} onClick={handleClickProject}>
                    <Link className="w-full" scroll={false}
                      href={"/#projects"}
                    >
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        See projects
                      </NavigationMenuLink>
                    </Link>
                  </MotionDiv>

                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
              <NavigationMenuContent>
                <MotionDiv animate={controls} onClick={handleClick}>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[176px] ">
                    {componentsPortfolio.map((component) => (
                      <Link className="w-full"
                        key={component.href}
                        href={component.href}
                      >
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          {component.title}
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </ul>
                </MotionDiv>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="inline-flex space-x-8 md:ml-[62rem]">
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger className="mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path

                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </SheetTrigger>
              <SheetContent side={"top"} className="bg h-[25rem]">
                <SheetHeader>
                  <SheetTitle>Akin</SheetTitle>
                  <SheetDescription>

                    <ul className="space-y-10 text-2xl list-inside">
                      {links.map((link) => (
                        <li key={link.href} className="flex items-center hover:bg-muted rounded "><Link className={classnames({
                          "w-full text-left p-5": link.label,
                          "text- border rounded": link.href == currentPath,
                          "nav-link": true
                        })} href={link.href}>{link.label}</Link></li>
                      ))}
                    </ul>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <AuthStatus />
          <ThemeToggle />
        </div>
      </div>
    </nav >

  );
};

export default NavBar;
