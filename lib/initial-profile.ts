import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { redirect } from "next/navigation"

import  { db } from "@/lib/db"

export const initialProfile = async () => {
    const session = await getServerSession(authOptions)
    console.log(session);
    
    if (!session?.user) {
        redirect('/sign-in')
    }
    const profile = await db.profile.findUnique({
        where: {
            userId: session?.user?.id
        }
    })
    if (profile) {
        return profile
    }

    const newProfile = await db.profile.create({
        data: {
            userId: session?.user?.id,
            imageUrl: "/favicon.ico",
            email: session?.user?.email,
        }
    })
    if (profile) {
        return profile
    }
}