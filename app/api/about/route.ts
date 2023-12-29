import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";


//used server action for this action. check actions.ts This is the api version 
export async function POST(request: NextRequest) {
    const body = await request.json();

    const createAbout = await prisma.info.create({
        data: { resume: body.resume, description: body.description }
    })

    if (!createAbout)
        return NextResponse.json(body, { status: 404 })
    return NextResponse.json({ body, status: 201 });
};

//GET ALL
export async function GET(request: NextRequest) {
    const body = await request.json()

    const infos = await prisma.info.findMany()



}


