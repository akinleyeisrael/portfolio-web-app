"use server";

import prisma from "@/lib/client";
import { revalidatePath } from "next/cache";
import { experienceSchema, infoSchema } from "./validationSchema";
import {
  InputExperience,
  InputInfo,
} from "@/app/(adminPanel)/admin/about/Forms";
import { InputsRegister } from "@/app/register/Form";
import { signIn, signOut } from "next-auth/react";
import { hash } from "bcrypt";
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { InputsSignIn } from "@/app/(home)/login/Form";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createInfo(formData: FormData) {
  //must safe parse formdata as string
  const validate = infoSchema.safeParse({
    resume: formData.get("resume") as string,
    description: formData.get("description") as string
  });
  if (!validate.success) {
    return (validate.error.format, { status: 400 })
  }

  const file = formData.get("resume") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const cloudinaryUpload: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            tags: ["resume"],
            folder: "uploads/resume",
            use_filename: true, // Maintain the original file name
          },

          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(error);
              return;
            }
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Cloudinary upload failed"));
            }
          }
        )
        .end(buffer);
    }
  );
  console.log(cloudinaryUpload)
  if (!cloudinaryUpload) {
    throw new Error("Unable to create cloud upload");
  }
  // Creating entry in Prisma database
  const info = await prisma.info.create({
    data: {
      public_id: cloudinaryUpload.public_id,
      resume: cloudinaryUpload.secure_url,
      description: formData.get("description") as string,
    },
  });
  if (!info) {
    throw new Error("Unable to create info");
  }
  revalidatePath("/admin/about");
  return info; // Return created info object
}


export async function editInfo(id: number, formData: FormData) {

  const validate = infoSchema.safeParse({
    resume: formData.get("resume") as string,
    description: formData.get("description") as string
  });
  if (!validate.success) {
    return (validate.error.format, { status: 400 })
  }
  //delete image from server first
  const infoToDelete = await prisma.info.findUnique({
    where: {
      id,
    },
  });
  if (!infoToDelete) {
    throw new Error("info to delete not found");
  }
  //delete image by public id
  const public_id = infoToDelete?.public_id;
  cloudinary.uploader.destroy(public_id!, { invalidate: true });
  const file = formData.get("resume") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Uploading file buffer to Cloudinary
  const cloudinaryUpload: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            tags: ["resume"],
            folder: "upload",
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(error);
              return;
            }
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Cloudinary upload failed"));
            }
          }
        )
        .end(buffer);
    }
  );
  const update = await prisma.info.update({
    where: {
      id,
    },
    data: {
      resume: cloudinaryUpload.secure_url,
      description: formData.get("description") as string,
    },
  });
  revalidatePath("/admin/about");
  return { update, success: true };
}

export async function deleteInfo(id: number) {
  const infoToDelete = await prisma.info.findUnique({
    where: {
      id,
    },
  });

  if (!infoToDelete) {
    throw new Error("info to delete not found");
  }

  //delete image by public id
  const public_id = infoToDelete?.public_id;
  cloudinary.uploader.destroy(public_id!);

  const info = await prisma.info.delete({
    where: {
      id,
    },
  });
  revalidatePath("/admin/about");
  return { info, message: "delete info" };
}

export async function checkIfInfoExists() {
  const infos = await prisma.info.findMany();
  const dataExists = infos.length > 0;
  return dataExists;
}

export async function createExperience(data: InputExperience) {

  const validation = experienceSchema.safeParse(data);
  if (!validation.success)
    return (validation.error.format(), { status: 400 })

  const experience = await prisma.experience.create({
    data: {
      jobtitle: data.jobtitle,
      company: data.company,
      year: data.year,
    },
  });
  revalidatePath("/admin/about");
  return { message: `experience create`, experience };
}

export async function editExperience(id: number, data: InputExperience) {

  const validation = experienceSchema.safeParse(data);
  if (!validation.success)
    return (validation.error.format(), { status: 400 })

  const info = await prisma.experience.update({
    where: {
      id,
    },
    data: data,
  });
  return { message: "edit", info };
}

export async function deleteExperience(id: number) {
  const info = await prisma.experience.delete({
    where: {
      id,
    },
  });
  revalidatePath("/admin/about");
  return { info };
}

export async function registerUser(data: InputsRegister) {
  // const userExists = await prisma.user.findUnique({
  //   where: {
  //     email: data.email,
  //   },
  // });
  // if (!userExists) {
  //   return { message: "User already Created", user: userExists };
  // } else {
  const hashedPassword = await hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      userName: data.userName,
      email: data.email,
      password: hashedPassword,
    },
  });
  return { user };
  // }
}

export async function editUser(id: string, data: InputsSignIn) {
  const hashedPassword = await hash(data.password, 10);

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      userName: data.userName,
      email: data.email,
      password: hashedPassword,
    },
  });

  return { user };
}

//admin Only
export async function deleteUser(id: string) {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return { message: "delete", user };
}
export async function checkIfUserEmailExists(data: InputsRegister) {
  const email = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  return { email };
}


 
//portfolio action
export const fetchSoftwareComponent = async () => {

  const softwarePortfolio = await prisma.porfolio.findMany(); // Example Prisma query for data set one
  return softwarePortfolio;
};

export const fetchVideoComponent = async () => {

  const videoPortfolio = await prisma.videoPortfolio.findMany(); // Example Prisma query for data set two
  return videoPortfolio;
};