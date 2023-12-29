import { GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";


const Footer = () => {
  return (
    <div>
      <footer className="flex max-w-7xl mx-auto justify-center max-h-screen w-full py-4" >
        <div className="font-thin text-xs space-x-3">
          <Link href="/admin" className=" text-gray-400 hover:text-primary">Admin</Link>
          <p className="inline-flex"><span className="text-gray-400">Made with </span><Link href={"https://github.com/akinleyeisrael/akinbusayo"}><GitHubLogoIcon className="inline-flex ml-1"/> personal-portfolio-webapp</Link></p>
        </div>

      </footer>
    </div>
  );
};

export default Footer;
