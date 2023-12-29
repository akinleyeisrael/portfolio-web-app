"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { registerUser } from '@/lib/actions'
import { userSchema } from '@/lib/validationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export type InputsRegister = z.infer<typeof userSchema>;

export const RegistrationForm = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false);


    const form = useForm<InputsRegister>({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = async (data: InputsRegister) => {  
        await registerUser(data)
        setOpen(false)
        form.reset()
        toast.success("user created")
        router.push("/admin")
    }
    return (
        <div className='mx-auto items-center max-w-xs min-h-screen mt-32 px-5'>
            <h1 className='mb-5 font-bold'>Register</h1>

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
        </div >
    )
}



