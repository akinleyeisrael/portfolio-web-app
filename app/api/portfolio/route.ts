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
})

//another example with route handler
export async function POST(request: NextRequest) {

    const body = await request.formData();
    
    console.log("body:", body)

    const validate = portfolioSchema.parse({
        media: body.get("media") as string,
        title: body.get("title") as string,
        description: body.get("description") as string,
        year: body.get("year") as string,
        link: body.get("link") as string,
        builtWith: body.getAll("builtWith").map((tech: FormDataEntryValue) => tech.toString())
    });
    if (!validate) {
        return NextResponse.json(validate)
    }

    const file = body.get("media") as File
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const cloudinaryUpload: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                tags: ["media", "image", "video "],
                folder: "uploads/portfolio",
            },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result!);
            }
        ).end(buffer); // Pass buffer directly here
    });

    const builtWith =  body.getAll("builtWith").map((tech: FormDataEntryValue) => tech.toString())


    const createPortfolio = await prisma.porfolio.create({
        data: {
            public_id: cloudinaryUpload.public_id,
            media: cloudinaryUpload.secure_url,
            title: body.get("title") as string,
            webTechs: {
                create: builtWith.map(framework => ({
                    framework
                }))
            },
            
            description: body.get("description") as string,
            year: body.get("year") as string, 
            link: body.get("link") as string,
        },
    });

    revalidatePath("/admin/portfolio");
    return NextResponse.json({ createPortfolio, status: 200 });

}

export async function GET(request: NextRequest) {

    const portfolio = await prisma.porfolio.findMany();
    return NextResponse.json(portfolio, { status: 200 })

}

