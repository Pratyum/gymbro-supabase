import { NextResponse } from 'next/server';
import {

    getUserOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization
} from '@/actions/organizations';
import { getUser } from '@/actions/user';
import { InsertOrganization } from '@/utils/db/schema';

export async function GET(req: Request) {
    try {
        const {dbUser} = await getUser();
        const {success, data} = await getUserOrganizations(dbUser.id);
        return NextResponse.json({ success: success, organizations: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'GET error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json() as InsertOrganization & { adminPhoneNumber : string};
        const organization = await createOrganization(data, data.adminPhoneNumber);
        return NextResponse.json({ success: true, organization }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'POST error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const data = await req.json() as Partial<InsertOrganization> & { id: number };
        const organization = await updateOrganization(data.id, data);
        return NextResponse.json({ success: true, organization });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'PATCH error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        await deleteOrganization(data.id);
        return NextResponse.json({ success: true, message: 'Organization deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'DELETE error' }, { status: 500 });
    }
}