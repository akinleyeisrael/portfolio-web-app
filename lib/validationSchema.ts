import { z } from "zod";

//create a objects that takes the shape of schema zod automatically maps them
const MAX_PDF_SIZE = 1000000;
const ACCEPTED_PDF_TYPES = ["application/pdf"];

export const infoSchema = z.object({
    resume: z
        .any()
        .refine((file) => file !== undefined && file !== null, "file is required.")
        .refine((file) => file?.size <= MAX_PDF_SIZE, `Max file size is 1MB.`)
        .refine(
            (file) => ACCEPTED_PDF_TYPES.includes(file?.type),
            "Only .pdf format is supported."
        ),
    description: z.string().min(1, "Description is required."),
    // .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
});

export const experienceSchema = z.object({
    jobtitle: z
        .string()
        .min(1, "Title is required.")
        .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
    company: z
        .string()
        .min(1, "Company is required.")
        .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
    year: z.coerce.date(),
});

export const webTechSchema = z.object({
    framework: z.string()
        .min(1, "framework is required"),
});
const MAX_MEDIA_SIZE = 10000000;
const ACCEPTED_MEDIA_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
export const portfolioSchema = z.object({
    media: z
        .any()
        .refine(
            (file) => file !== undefined && file !== null,
            "Media image file is required."
        )
        .refine(
            (file) => ACCEPTED_MEDIA_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .refine((file) => file?.size <= MAX_MEDIA_SIZE, `Max media size is 10MB.`),
    title: z
        .string()
        .min(1, "Title is required")
        .max(30, "Maximum is 30 characters")
        .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
    webTech: z.any(),
    description: z.string().min(1, "Description is required."),
    year: z
        .string()
        .min(1, "year is required")
        .max(4, "Maximum is 4 characters")
        .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
    link: z
        .string()
        .url()
        .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
});

const MAX_THUMBNAIL_SIZE = 10000000;
const ACCEPTED_THUMBNAIL_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
export const videoSchema = z.object({
    thumbnail: z
        .any()
        .refine(
            (file) => file !== undefined && file !== null,
            "Thumbnail is required."
        )
        .refine(
            (file) => ACCEPTED_THUMBNAIL_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .refine(
            (file) => file?.size <= MAX_THUMBNAIL_SIZE,
            `Max image size is 10MB.`
        ),
    videoId: z
        .string()
        .min(1, "url(video id) is required")
        .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
    title: z
        .string()
        .min(1, "title is required")
        .regex(/^^\w(?:\s*\S+\s*)*$/, "starting with empty string not allowed"),
});

export const userSchema = z.object({
    userName: z.string().min(1),
    email: z.string().min(1).email("Email is Invalid"),
    password: z.string(),
});
