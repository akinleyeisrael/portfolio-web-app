
"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export default function Logout() {
  const router = useRouter()
  return (
    <p
      className="w-full hover:cursor-pointer"
      onClick={(() => {
        signOut()
        router.push("/")
        toast.success("Logout success")
      })}
    >
      Log out
    </p >
  );
}
