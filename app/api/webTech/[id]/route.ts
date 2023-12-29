import prisma from "@/lib/client";
import { webTechSchema } from "@/lib/validationSchema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const  body  = await request.json()

    const validate = webTechSchema.safeParse(body);
    if (!validate.success) {
        return NextResponse.json(validate.error.format, { status: 404 })
    }

    const webTech = await prisma.webTech.update({
        where: {
            id: parseInt(params.id),
        },
        data: {
            framework: body.framework
        }
    })

    if (!webTech) {
        return NextResponse.json(webTech, { status: 404 })
    }
    return NextResponse.json(webTech, { status: 201 })

}

export async function DELETE(
    req: NextRequest,
    { params: { id } }: { params: { id: string } }
) { 

    const deleteWebTech = await prisma.webTech.delete({
        where: {
            id: parseInt(id),
        },
    });
    if (!deleteWebTech)
        return NextResponse.json("id to delete not exist", { status: 404 });
    return NextResponse.json(deleteWebTech, { status: 200 });
}
