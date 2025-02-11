
import { NEXT_AUTH_CONFIG } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        const user = session?.user;

        const userInfo = await prisma.user.findFirst({
            where:{
                email: user?.email
            },
            select:{
                id: true,
                name: true,
                email: true,
                createdAt: true,
                purchases:{
                    where: {status: 'COMPLETED'},
                    select:{
                        id: true,
                        product:{
                            select:{
                                id: true,
                                title: true,
                                thumbnailImage: true,
                                driveLink: true,
                            }
                        }
                    }
                }
            }
        },)

        return NextResponse.json({
            userInfo,
        },{
            status:200
        })
    } catch(e) {
        console.log('Error', e);
        return NextResponse.json(
        {
            error: 'Internal Server Error',
            details: e,
        },
        {
            status: 500,
        }
        );
    }
}