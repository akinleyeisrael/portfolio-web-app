import prisma from "@/lib/client";
import { videoSchema } from "@/lib/validationSchema";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {

    const body = await request.formData();

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
                        tags: ["VideoPortfolio", "thumbnail"],
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
    console.log(cloudinaryUpload)

    const video = await prisma.videoPortfolio.create({
        data: {
            public_id: cloudinaryUpload?.public_id,
            thumbnail: cloudinaryUpload.secure_url,
            videoId: body.get("videoId") as string,  //video url id
            title: body.get("title") as string,
        },
    });

    return NextResponse.json(video, { status: 200 });
}
