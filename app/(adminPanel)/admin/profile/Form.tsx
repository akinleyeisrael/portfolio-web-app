"use client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { userSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkIfUserEmailExists, deleteExperience, deleteUser, editUser, registerUser } from "@/lib/actions";
import { User } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";


export type InputsRegister = z.infer<typeof userSchema>;

export const ProfileForm = ({ user }: { user: User }) => {
    const router = useRouter()


    const formProfile = useForm<InputsRegister>({
        mode: "onChange",
        resolver: zodResolver(userSchema),
        defaultValues: {
            userName: user.userName,
            email: user.email,
        },
    });

    const onSubmit = (data: InputsRegister) => {
        editUser(user.id, data);
        toast.success("Account information has been updated.")
        signOut()
        router.refresh()
    };
    return (
        <div>

            <Form {...formProfile}>
                <form
                    onSubmit={formProfile.handleSubmit(onSubmit)}
                    className="space-y-8"
                    autoComplete="off"
                // ref={formRef}
                >
                    <FormField
                        control={formProfile.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Username</Label>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={formProfile.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Email</Label>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={formProfile.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <Label>Password</Label>
                                <FormControl>
                                    <Input
                                        placeholder="Input new password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" >Save Changes</Button>
                </form>
            </Form>

        </div>
    );
};

//ADMIN ONLY
export const RegistrationUserForm = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false);


    const form = useForm<InputsRegister>({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = async (data: InputsRegister) => {
        const userEmailExists = await checkIfUserEmailExists(data);
        if (!userEmailExists.email) {
            await registerUser(data)
            setOpen(false)
            toast.success("user created")
            form.reset()
        }
        else {
            toast.error("user email already exists. Cannot create.")
        }
        router.refresh()
    }
    return (
        <div className=''>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>{<Button variant="outline">Create</Button>}</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-5">New User</DialogTitle>
                        <DialogDescription>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="userName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="UserName" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email" {...field} />
                                                </FormControl>
                                                <FormMessage />
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
                                                    <Input placeholder="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Register</Button>
                                </form>
                            </Form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div >
    )
}


export const DeleteUserButton = ({ id }: { id: string }) => {
    let [isPending, startTransition] = useTransition();
    const router = useRouter();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild color="blue">
                <Button variant="default">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion.</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isPending}
                        onClick={() => {
                            try {
                                startTransition(async () => {
                                    deleteUser(id);
                                    toast.success("User Deleted!");
                                    router.refresh();
                                });
                            } catch (error) {
                                console.error("error occured while deleting");
                            }
                        }}
                    >
                        {isPending ? <ClipLoader color="#c0d1ce" size={10} /> : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
};
