
import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    const body = await req.json();
    const updateAbout = await prisma.info.update({
        where: {
            id: parseInt(id)
        },
        data: {
            resume: body.resume,
            description: body.description
        }
    })

    if (!updateAbout)
        return NextResponse.json({ message: "invalid about request" }, { status: 404 })
    return NextResponse.json(updateAbout, { status: 201 })
}


export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    const findAbout = await prisma.info.findUnique({
        where: { id: parseInt(id) }
    })

    if (!findAbout)
        return NextResponse.json(findAbout, { status: 404 })
    const deleteAbout = await prisma.info.delete({
        where: { id: parseInt(id) }
    })

    if (!deleteAbout)
        return NextResponse.json("id to delete not exist", { status: 404 })
}