import prisma from "@/lib/client";
import { videoSchema } from "@/lib/validationSchema";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function PATCH(
    request: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    const body = await request.formData();

    //delete image from server first
    const videoPortfolioToDelete = await prisma.videoPortfolio.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!videoPortfolioToDelete) {
        throw new Error("video to delete not found");
    }
    //delete image by public id
    const public_id = videoPortfolioToDelete.public_id;
    cloudinary.uploader.destroy(public_id!, { invalidate: true });

    const validate = videoSchema.parse({
        thumbnail: body.get("thumbnail") as string,
        videoId: body.get("videoId") as string,
        title: body.get("title") as string,
    });
    if (!validate) {
        return NextResponse.json(validate);
    }

    const file = body.get("thumbnail") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const cloudinaryUpload: UploadApiResponse = await new Promise(
        (resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        tags: ["VideoPortfolio"],
                        folder: "uploads/VideoPortfolio",
                    },
                    (
                        error: UploadApiErrorResponse | undefined,
                        result: UploadApiResponse | undefined
                    ) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve(result!);
                    }
                )
                .end(buffer); // Pass buffer directly here
        }
    );

    const video = await prisma.videoPortfolio.update({
        where: {
            id: parseInt(id),
        },
        data: {
            public_id: cloudinaryUpload.public_id,
            thumbnail: cloudinaryUpload.secure_url,
            videoId: body.get("videoId") as string,
            title: body.get("title") as string,
        },
    });

    return NextResponse.json(video, { status: 201 });


}

export async function DELETE(
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    const findVideoPortfolio = await prisma.videoPortfolio.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!findVideoPortfolio)
        return NextResponse.json("could not find id", { status: 404 });

    const public_id = findVideoPortfolio?.public_id;
    cloudinary.uploader.destroy(public_id!, { invalidate: true });

    const deleteVideoPortfolio = await prisma.videoPortfolio.delete({
        where: {
            id: parseInt(id),
        },
    });
    if (!deleteVideoPortfolio)
        return NextResponse.json("id to delete not exist", { status: 404 });

    revalidatePath("/admin/portfolio/video");
    return NextResponse.json(deleteVideoPortfolio, { status: 200 });
}
