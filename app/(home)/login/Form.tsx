"use client";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createExperience } from "@/lib/actions";
import { userSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type InputsSignIn = z.infer<typeof userSchema>;
export const SigninForm = () => {
    const router = useRouter();
    const [error, setError] = useState("");

    const form = useForm<InputsSignIn>({
        resolver: zodResolver(userSchema),
    });
    const onSubmit = async (data: FormData) => {
        try {
            const userIn = await signIn("credentials", {
                email: data.get("email") as string,
                password: data.get("password") as string,
                redirect: true,
                callbackUrl: "/admin"
            });
            if (userIn?.error) {
                setError("Email or password is not associated with an account");
            } else {
                setError('')
                router.push("/admin");
                toast.success("User valid.You now have access to the dashboard.");
                router.refresh();
            }
        } catch (error) {
            throw new Error("error signing in")
        }
    };

    return (
        <div className="min-h-screen">
            <div className="mx-auto items-center max-w-xs mt-32 p-10 bg-secondary rounded-lg border">

                <h1 className="mb-5 font-bold">Sign in</h1>
                <Form {...form}>
                    {error && (
                        <Alert variant="destructive" className="mb-3">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form action={onSubmit}  /* onSubmit={form.handleSubmit(onSubmit)} */ className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Sign In</Button>
                    </form>
                </Form>
            </div>
        </div>

    );
};

export default SigninForm;
