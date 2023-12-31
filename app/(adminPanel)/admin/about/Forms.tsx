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
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  checkIfInfoExists,
  createExperience,
  createInfo,
  deleteExperience,
  deleteInfo,
  editExperience,
  editInfo,
} from "@/lib/actions";
import { cn } from "@/lib/utils";
import { experienceSchema, infoSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Experience, Info } from "@prisma/client";
import { CalendarIcon, ExclamationTriangleIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import DotLoader from "react-spinners/DotLoader";
import { toast } from "sonner";
import { z } from "zod";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";


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

const ReactQuill = dynamic(
  () =>
    import("react-quill"),
  {
    ssr: false,
  }
);

// const ReactQuill = typeof window === "object" ? require("react-quill") : () => false;

export type InputInfo = z.infer<typeof infoSchema>;

export const InfoForm = ({ info }: { info?: Info }) => {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formInfo = useForm<InputInfo>({
    mode: "onChange",
    resolver: zodResolver(infoSchema),
    defaultValues: {
      description: info ? info.description : "",
    },
  });

  // const fetchData = async () => {
  // useeffect to prevent contunousl loadin
  //     const infoExists = await checkIfInfoExists();
  //     return infoExists;
  // }
  // fetchData().then(exist => {
  //     setInfoExists(!exist)
  // })

  const onsubmitInfo = async (data: InputInfo) => {
    const formData = new FormData();
    formData.append("resume", data.resume);
    formData.append("description", data.description);

    console.log(data)

    try {
      setIsSubmitting(true);
      if (info) {
        await editInfo(info.id, formData);
        setOpen(false);
        toast.success("Update success.");
      } else {
        const infoExistsInDatabase = await checkIfInfoExists();
        if (!infoExistsInDatabase) {
          await createInfo(formData);
          setOpen(false);
          toast.success(
            "Description created. Check '/about' page to view changes."
          );

        } else {
          toast.warning("Form cannot be created", {
            description: "Form can only be created once unless deleted.",
          });
        }
      }
      setIsSubmitting(false);
      formInfo.reset();
      router.refresh();
    } catch (error) {
      setIsSubmitting(false);
      setErr("Error occured during the process contact developer.");
    }
  };

  return (
    <section className="mx-auto md:pt-0 " id="#desc">
      {err && (
        <Alert variant="destructive" className="mb-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          {info ? <Pencil2Icon /> : <Button variant="outline">Create</Button>}
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-5">
              {info ? "Edit Info Form" : "New Description Form"}
            </DialogTitle>
            <DialogDescription>
              <Form {...formInfo}>
                <form
                  // action={onsubmitInfo}
                  autoComplete="off"
                  onSubmit={formInfo.handleSubmit(onsubmitInfo)}
                  className="space-y-8"
                >
                  <FormField
                    control={formInfo.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Resume</Label>
                        <FormControl>
                          <Input
                            title="upload pdf file"
                            accept=".pdf"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                            type="file"
                            placeholder="resume"
                          // {...field}
                          />
                        </FormControl>
                        {/* <Button><UploadIcon className="mr-1" />Upload</Button> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formInfo.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Description</Label>
                        <FormControl>
                          <ReactQuill className="max-w-[29rem]"
                            {...field}
                            onChange={(e: any) => field.onChange(e)}
                            theme="snow"
                            formats={formats}
                            modules={modules} />
                          {/* <Textarea
                            disabled={
                              !formInfo.formState.isValid ||
                              !formInfo.formState.isDirty
                            } 
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none"
                            // defaultValue={info?.description || undefined}
                            {...field}
                          />   */}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormButton />
                  {/* <Button disabled={isSubmitting} type="submit" className="mt-10">
                    {isSubmitting && (
                      <DotLoader className="mr-2" color="#c0d1ce" size={10} />
                    )}
                    {info ? "Save" : "Add"}
                  </Button> */}
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export type InputExperience = z.infer<typeof experienceSchema>;
export const ExperienceForm = ({ exp }: { exp?: Experience }) => {
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState<Date>();

  const formExperience = useForm<InputExperience>({
    mode: "onChange",
    defaultValues: exp,
    resolver: zodResolver(experienceSchema),
  });

  const onSubmitExperience = async (data: InputExperience) => {
    try {
      setIsSubmitting(true);
      if (exp) {
        await editExperience(exp.id, data);
        setOpen(false);
        toast.success("Update Sucess.");
        setIsSubmitting(false);
      } else {
        await createExperience(data);
        setErr("");
        setOpen(false);
        toast.success(
          " Experience created.Check the /about page to see changes."
        );
        setIsSubmitting(false);
        formExperience.reset();
      }
      router.refresh();
    } catch (error) {
      setIsSubmitting(false);
      setErr("Error occured during the process");
    }
  };
  return (
    <section className="mx-auto" id="exp">
      {err && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{err}</AlertDescription>
        </Alert>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          {exp ? <Pencil2Icon /> : <Button variant="outline">Create</Button>}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-5">
              {exp ? "Edit Experience Form" : "New Experience Form"}
            </DialogTitle>
            <DialogDescription>
              <Form {...formExperience}>
                <form
                  autoComplete="off"
                  onSubmit={formExperience.handleSubmit(onSubmitExperience)}
                  className="space-y-8"
                // ref={formRef2}
                >
                  <FormField
                    control={formExperience.control}
                    name="jobtitle"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Job Title</Label>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formExperience.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Company</Label>

                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formExperience.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Year</Label>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(new Date(field.value), "MMMM")
                                ) : (
                                  <span>Pick a month</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) => {
                                  field.onChange(date); // This updates the form's value
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormButton />
                  {/* <Button disabled={isSubmitting} type="submit">
                    {isSubmitting && (
                      <DotLoader className="mr-2" color="#c0d1ce" size={10} />
                    )}
                    {exp ? "Save" : "Add"}
                  </Button> */}
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};



const FormButton = () => {
  const { pending } = useFormStatus();
  return (
    <div>
      <Button disabled={pending} type="submit" className={cn(
        "bg-blue-500 transition-all border border-transparent text-white rounded-md p-2",
        pending
          ? "border-gray-300 bg-gray-200 cursor-not-allowed"
          : "hover:bg-blue-600 active:bg-blue-700"
      )}>

        {pending ? <DotLoader className="mr-2" color="#c0d1ce" size={10} /> : <p>Save</p>}


      </Button>
    </div>
  )
}



export const EditInfoForm = ({ info }: { info: Info }) => {
  return <InfoForm info={info} />;
};

export const EditExperienceForm = ({ exp }: { exp: Experience }) => {
  return <ExperienceForm exp={exp} />;
};

export const DeleteInfoButton = ({ id }: { id: number }) => {
  let [isPending, startTransition] = useTransition();

  const router = useRouter();
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild color="blue">
          <Button variant="default">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion.</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this description? This action
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
                    deleteInfo(id);
                    toast.success("Delete Sucessfull!");
                    router.refresh();
                  });
                } catch (error) {
                  toast.error("error deleting");
                }
              }}
            >
              {isPending && (
                <DotLoader className="mr-2" color="#c0d1ce" size={10} />
              )}
              {"Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const DeleteExperienceButton = ({ id }: { id: number }) => {
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
            Are you sure you want to delete this description? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              try {
                startTransition(async () => {
                  deleteExperience(id);
                  toast.success("Delete Sucessfull!");
                  router.refresh();
                });
              } catch (error) {
                console.error("error deleting");
              }
            }}
          >
            {isPending && (
              <DotLoader className="mr-2" color="#c0d1ce" size={10} />
            )}
            {"Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
