import prisma from "@/lib/client";
import { webTechSchema } from "@/lib/validationSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const  body  = await request.json()

    const validate = webTechSchema.safeParse(body);
    if (!validate.success) {
        return NextResponse.json(validate.error.format, { status: 404  })
    }

    const webTech = await prisma.webTech.create({
        data: {
            framework: body.framework
        }
    })

    if(!webTech){
        return NextResponse.json(webTech, {status: 404})
    }
    return NextResponse.json(webTech, {status : 201})

}


export async function GET(request: NextRequest) {

    const webTechs = await prisma.webTech.findMany();
    return NextResponse.json(webTechs, { status: 200 })

}