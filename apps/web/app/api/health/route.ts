

import { prisma } from "../../../../../packages/db/src/index";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const res = await prisma.$queryRaw`SELECT 1`;

       return NextResponse.json({
            message:'health ok'
        },
        {status:200})
    }
    catch{
        return NextResponse.json({
            message: 'services failed'
        },
            { status: 503 })
    }
}