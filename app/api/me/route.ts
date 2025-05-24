import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser, updateUser } from '@/actions/user';
import { InsertUser } from '@/utils/db/schema';

export async function GET(req: NextRequest) {
    try {
        const user = await getUser();
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.error();
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const data = await req.json() as InsertUser;
        const {dbUser} = await getUser();
        const updatedUser = await updateUser(dbUser.id, data);
        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        return NextResponse.error();
    }
}