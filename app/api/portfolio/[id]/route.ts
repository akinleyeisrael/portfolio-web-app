import prisma from "@/lib/client";
import { portfolioSchema } from "@/lib/validationSchema";
import {
    UploadApiErrorResponse,
    UploadApiResponse,
    v2 as cloudinary,
} from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    const body = await req.formData();

    const validate = portfolioSchema.parse({
        media: body.get("media") as string,
        title: body.get("title") as string,
        description: body.get("description") as string,
        year: body.get("year") as string,
        link: body.get("link") as string,
    });
    if (!validate) {
        return NextResponse.json(validate)
    }

    const findPortfolio = await prisma.porfolio.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    const public_id = findPortfolio?.public_id;
    cloudinary.uploader.destroy(public_id!);

    const file = body.get("media") as File;
    console.log("file:", file);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const cloudinaryUpload: UploadApiResponse = await new Promise(
        (resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        tags: ["media", "pictures", "videos"],
                        folder: "uploads/portfolio",
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

    const updatePortfolio = await prisma.porfolio.update({
        where: {
            id: parseInt(id),
        },
        data: {
            public_id: cloudinaryUpload.public_id,
            media: cloudinaryUpload.secure_url,
            title: body.get("title") as string,
            description: body.get("description") as string,
            year: body.get("year") as string,
            link: body.get("link") as string,
        },
    });
    if (!updatePortfolio)
        return NextResponse.json(
            { message: "invalid porfolio request" },
            { status: 404 }
        );
    revalidatePath("/admin/porfolio");
    return NextResponse.json(updatePortfolio, { status: 200 });
}

export async function DELETE(
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
) {
    const findPortfolio = await prisma.porfolio.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!findPortfolio)
        return NextResponse.json("could not find id", { status: 404 });

    const public_id = findPortfolio?.public_id;
    cloudinary.uploader.destroy(public_id!);

    const deletePortfolio = await prisma.porfolio.delete({
        where: {
            id: parseInt(id),
        },
    });
    if (!deletePortfolio)
        return NextResponse.json("id to delete not exist", { status: 404 });
    
    revalidatePath("/admin/portfolio");
    return NextResponse.json(deletePortfolio, { status: 200 });
}
