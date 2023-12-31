"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
    portfolioSchema,
    videoSchema,
    webTechSchema,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Porfolio, VideoPortfolio, WebTech } from "@prisma/client";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { ExclamationTriangleIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { Edit } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import DotLoader from "react-spinners/DotLoader";
import { toast } from "sonner";
import { z } from "zod";

/* React quill */
const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
];
/*React QUill */

const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
});

//OLD WAY OF DOING THINGSS
export type InputsWebTech = z.infer<typeof webTechSchema>;
export const WebTechForm = ({ webTech }: { webTech?: WebTech }) => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);


    const form = useForm<InputsWebTech>({
        mode: "onChange",
        resolver: zodResolver(webTechSchema),
        defaultValues: webTech,
    });
    const onSubmit = async (data: InputsWebTech) => {
        console.log("data", data);

        try {
            setSubmitting(true);
            if (webTech) {
                await fetch(`/api/webTech/${webTech.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(data),
                }).then((res) => res.json());
                setOpen(false);
                toast.success("Update Sucessful.");
            } else {
                await fetch("/api/webTech", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                }).then((res) => res.json());
                setOpen(false);
                toast.success("Create successful");
            }
            setError("");
            setSubmitting(false);
            form.reset();
            router.refresh();
        } catch (error) {
            setSubmitting(false);
            setError("error occured during the process. Report back to developer.");
        }
    };
    return (
        <section className="mx-auto" id="port">
            <div className="flex-grow">
                {error && (
                    <Alert variant="destructive" className="mb-3">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        {webTech ? (
                            <Pencil2Icon />
                        ) : (
                            <Button variant="outline">Create</Button>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="pb-5">
                                {webTech ? "Edit Web Tech" : "New Web Tech"}
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8"
                                    autoComplete="off"
                                // ref={formRef}
                                >
                                    <FormField
                                        control={form.control}
                                        name="framework"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label>Framework</Label>
                                                <FormControl>
                                                    <Input type="text" className="resize-none" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="inline-flex" disabled={isSubmitting} type="submit">
                                        {isSubmitting && (
                                            <DotLoader className="mr-2" color="#c0d1ce" size={10} />
                                        )}
                                        {webTech ? "Save" : "Add"}
                                    </Button>
                                </form>
                            </Form>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

            </div>
        </section>
    );
};

export type Inputs = z.infer<typeof portfolioSchema>;

//alternative to useeffect
const getWebTech = async () => {

}

interface webTechProp {
    id: number,
    framework: string
}
export const PorfolioForm = ({ porfolio }: { porfolio?: Porfolio }) => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [webTechs, setWebTechs] = useState<any[]>([]);
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/webTech`)
                setWebTechs(await response.json());
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            router.refresh()
        };
        fetchData();
    }, [router]);

    // getWebTechs() 


    const form = useForm<Inputs>({
        mode: "onChange",
        resolver: zodResolver(portfolioSchema),
        defaultValues: {
            description: porfolio ? porfolio.description : "",
            link: porfolio ? porfolio.link : "",
            media: porfolio ? porfolio.media : "",
            title: porfolio ? porfolio.title! : "",
            year: porfolio ? porfolio.year! : "",
        },
    });


    const onSubmit = async (data: Inputs) => {
        console.log("data", data);
        const formData = new FormData();
        formData.append("media", data.media);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("year", data.year);
        formData.append("link", data.link);
        selectedFrameworks.forEach((framework) => {
            formData.append("builtWith", framework);
        });





        try {
            setSubmitting(true);
            if (porfolio) {
                await fetch(`/api/portfolio/${porfolio.id}`, {
                    method: "PATCH",
                    body: formData,
                }).then((res) => res.json());
                setOpen(false);
                toast.success("Update Sucessful.");
            } else {
                await fetch("/api/portfolio", {
                    method: "POST",
                    body: formData,
                }).then((res) => res.json());
                setOpen(false);
                toast.success("Created portfolio.Check /portfolio for changes.");
            }

            setError("");
            setSelectedFrameworks([]); // Reset to an empty array
            setSubmitting(false);
            form.reset();
            router.refresh();
        } catch (error) {
            setSubmitting(false);
            setError("error occured during the process. Report back to developer.");
        }
    };

    return (
        <section className="mx-auto" id="port">
            <div className="flex-grow">
                {error && (
                    <Alert variant="destructive" className="mb-3">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        {porfolio ? (
                            <Pencil2Icon />
                        ) : (
                            <Button variant="outline">Create</Button>
                        )}
                    </DialogTrigger>
                    <DialogContent className="max-w-[60rem]">
                        <DialogHeader>
                            <DialogTitle className="pb-5">
                                {porfolio ? "Edit Portfolio" : "New Portfolio"}
                            </DialogTitle>
                            <DialogDescription>
                                <Form {...form}>
                                    <form
                                        encType="multipart/form-data"
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-8"
                                        autoComplete="off"
                                    // ref={formRef}
                                    >
                                        <FormField
                                            control={form.control}
                                            name="media"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Media</Label>
                                                    <FormControl>
                                                        <Input
                                                            accept="image/png, image/gif, image/jpeg, image/webp, image/jpg, image/jpeg"
                                                            title="image upload"
                                                            type="file"
                                                            placeholder="upload image"
                                                            onChange={(e) => {
                                                                field.onChange(e.target.files?.[0]);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Title</Label>
                                                    <FormControl>
                                                        <Input
                                                            className="resize-none"
                                                            placeholder="Enter project title"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="webTech"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Built With</Label>
                                                    <FormControl>
                                                        <Popover>
                                                            <PopoverTrigger className="ml-20">Open</PopoverTrigger>
                                                            <PopoverContent className="w-32">
                                                                {webTechs.map((framework: webTechProp) => (
                                                                    <div key={framework.framework} className="flex items-center space-x-2">
                                                                        <Checkbox
                                                                            checked={selectedFrameworks.includes(framework.framework)}
                                                                            onCheckedChange={(checked) => {
                                                                                let updatedValue = [...selectedFrameworks];

                                                                                if (checked) {
                                                                                    updatedValue = [...selectedFrameworks, framework.framework];
                                                                                } else {
                                                                                    updatedValue = selectedFrameworks.filter(
                                                                                        (value) => value !== framework.framework
                                                                                    );
                                                                                }

                                                                                setSelectedFrameworks(updatedValue);
                                                                            }}
                                                                            id={`terms_${framework.id}`}
                                                                        />
                                                                        <label htmlFor={`terms_${framework.id}`} className="">
                                                                            {framework.framework}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </PopoverContent>
                                                        </Popover>
                                                        {/* <Input
                                                            type=""
                                                            className="resize-none"
                                                            placeholder="Enter framework used to build project"
                                                            {...field}
                                                        /> */}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="year"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Year</Label>
                                                    <FormControl>
                                                        <Input
                                                            className="resize-none"
                                                            placeholder="Enter year of project development"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="link"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Link</Label>
                                                    <FormControl>
                                                        <Input
                                                            className="resize-none"
                                                            placeholder="Insert link of project website or github"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Description</Label>
                                                    <FormControl>
                                                        {/* <ReactQuill
                                                            className="max-w-[58rem]"
                                                            {...field}
                                                            onChange={(e: any) => field.onChange(e)}
                                                            theme="snow"
                                                            formats={formats}
                                                            modules={modules}
                                                        /> */}
                                                        <Textarea
                                                            // defaultValue={porfolio?.description || undefined}
                                                            className="resize-none"
                                                            // onChange={field.onChange => e.tarhe}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button disabled={isSubmitting} type="submit">
                                            {isSubmitting && (
                                                <DotLoader className="mr-2" color="#c0d1ce" size={10} />
                                            )}
                                            {porfolio ? "Save" : "Add"}
                                        </Button>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
};

export type InputsVideo = z.infer<typeof videoSchema>;
export const VideoForm = ({ video }: { video?: VideoPortfolio }) => {
    const router = useRouter();
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    const formVideo = useForm<InputsVideo>({
        mode: "onChange",
        resolver: zodResolver(videoSchema),
        defaultValues: {
            videoId: video ? video.videoId! : "",
            title: video ? video.title : "",
        },
    });

    const onSubmitVideo: SubmitHandler<InputsVideo> = async (data) => {
        console.log("data", data);
        const formData = new FormData();
        formData.append("thumbnail", data.thumbnail);
        formData.append("videoId", data.videoId);
        formData.append("title", data.title);
        console.log(formData);

        try {
            setSubmitting(true);
            if (video) {
                await fetch(`/api/videoPortfolio/${video.id}`, {
                    method: "PATCH",
                    body: formData,
                }).then((res) => res.json());
                setOpen(false);
                toast.success("Update Sucessful.");
            } else {
                await fetch("/api/videoPortfolio", {
                    method: "POST",
                    body: formData,
                }).then((res) => res.json());
                setOpen(false);
                toast.success(
                    "Video has been create check the porfolio/video page to view changes."
                );
            }
            setError("");
            setSubmitting(false);
            formVideo.reset();
            router.refresh();
        } catch (error) {
            setSubmitting(false);
            setError("Error performing request. Contact developer.");
        }
    };
    return (
        <section className="mx-auto" id="vid">
            <div className="flex-grow">
                {error && (
                    <Alert variant="destructive" className="mb-3">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        {video ? (
                            <Pencil2Icon />
                        ) : (
                            <Button variant="outline">Create</Button>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="pb-5">
                                {video ? "Edit Video" : "New Video"}
                            </DialogTitle>
                            <DialogDescription>
                                <Form {...formVideo}>
                                    <form
                                        encType="multipart/form-data"
                                        onSubmit={formVideo.handleSubmit(onSubmitVideo)}
                                        className="space-y-8"
                                        autoComplete="off"
                                    >
                                        <FormField
                                            control={formVideo.control}
                                            name="thumbnail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Thumbnail</Label>
                                                    <FormControl>
                                                        <Input
                                                            accept="image/png, image/gif, image/jpeg, image/webp, image/jpg, image/jpeg"
                                                            type="file"
                                                            title="image upload"
                                                            onChange={(e) =>
                                                                field.onChange(e.target.files?.[0])
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formVideo.control}
                                            name="videoId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Video - Youtube</Label>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter the url id of the youtube video"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={formVideo.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label>Title</Label>
                                                    <FormControl>
                                                        <Input className="resize-none" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button disabled={isSubmitting} type="submit">
                                            {isSubmitting && (
                                                <DotLoader className="mr-2" color="#c0d1ce" size={10} />
                                            )}
                                            {"   "}
                                            {video ? "Save" : "Add"}
                                        </Button>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
};

export const EditVideoForm = ({ video }: { video: VideoPortfolio }) => {
    return (
        <div>
            <VideoForm video={video} />
        </div>
    );
};
export const EditWebTechForm = ({ webTech }: { webTech: WebTech }) => {
    return (
        <div>
            <WebTechForm webTech={webTech} />
        </div>
    );
};
export const EditPortfolioForm = ({ porfolio }: { porfolio: Porfolio }) => {
    return (
        <div>
            <PorfolioForm porfolio={porfolio} />
        </div>
    );
};
export const DeleteWebTechButton = ({ id }: { id: number }) => {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild color="red">
                <TrashIcon className="hover:cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion.</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this portfolio? This action cannot
                        be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleting}
                        onClick={async () => {
                            try {
                                setDeleting(true);
                                await fetch(`/api/webTech/${id}`, {
                                    method: "DELETE",
                                });
                                setDeleting(false);
                                toast.success("Delete Success.");
                                router.refresh();
                            } catch (error) {
                                setDeleting(false);
                                console.error("error occured!!");
                            }
                        }}
                    >
                        {deleting && <DotLoader className="mr-2" color="white" size={10} />}
                        {"Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export const DeletePortfolioButton = ({ id }: { id: number }) => {
    const [deleting, setDeleting] = useState(false);
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
                        Are you sure you want to delete this portfolio? This action cannot
                        be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleting}
                        onClick={async () => {
                            try {
                                setDeleting(true);
                                await fetch(`/api/portfolio/${id}`, {
                                    method: "DELETE",
                                });
                                setDeleting(false);
                                toast.success("Delete Success.");
                                router.refresh();
                            } catch (error) {
                                setDeleting(false);
                                console.error("error occured!!");
                            }
                        }}
                    >
                        {deleting && <DotLoader className="mr-2" color="white" size={10} />}
                        {"Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export const DeleteVideoButton = ({ id }: { id: number }) => {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild color="blue">
                    <Button variant="default">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion.</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this portfolio? This action cannot
                            be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={deleting}
                            onClick={async () => {
                                setDeleting(true);
                                try {
                                    await fetch(`/api/videoPortfolio/${id}`, {
                                        method: "DELETE",
                                    });
                                    setDeleting(false);
                                    router.refresh();
                                    toast.success("Delete Success.");
                                } catch (error) {
                                    setDeleting(false);
                                    console.error("error delettimg");
                                }
                            }}
                        >
                            {deleting && (
                                <DotLoader className="mr-2" color="white" size={10} />
                            )}
                            {"Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
